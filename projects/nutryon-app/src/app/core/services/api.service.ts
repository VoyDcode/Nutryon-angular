import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { User, Meal } from '../models/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private authUrl = '/auth'; // Proxy maps /auth exactly

  constructor(private http: HttpClient) { }

  // User Endpoints
  register(user: Partial<User>): Observable<any> {
    const payload = {
      nome: user.name,
      email: user.email,
      senha: user.password,
      role: 'USER'
    };
    return this.http.post<any>(`${this.authUrl}/register`, payload);
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.authUrl}/login`, credentials);
  }

  getProfile(): Observable<User> {
    throw new Error('Not implemented on backend yet. Handled strictly by AuthService.');
  }

  updateProfile(user: Partial<User>): Observable<User> {
    throw new Error('Not implemented on backend yet. Handled strictly by AuthService.');
  }

  // Meal Endpoints
  getMeals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/refeicoes`).pipe(
      map(data => data.map(item => ({
        id: item.id.toString(),
        userId: item.usuarioId.toString(),
        name: item.itens.length > 0 ? item.itens[0].ingredienteNome : 'Refeição',
        kcal: 0, // In Dashboard relies on daily summary natively
        protein: 0,
        carbs: 0,
        fat: 0,
        timestamp: item.data
      })))
    );
  }

  getDashboardSummary(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/refeicoes/resumo-diario/${date}`);
  }

  createMeal(meal: Partial<Meal>): Observable<any> {
    const today = new Date().toISOString().split('T')[0];

    const antiCache = new Date().getTime();
    // Check which meal slots are already used today to avoid Backend UniqueConstraint Violation
    return this.http.get<any>(`${this.apiUrl}/refeicoes?data=${today}&_cb=${antiCache}`).pipe(
      switchMap((response) => {
        const mealsList = Array.isArray(response) ? response : (response.content || []);
        const todaysMeals = mealsList.filter((m: any) => !m.data || m.data.startsWith(today));

        const takenTypes = todaysMeals.map((m: any) => m.tipo || m.tipoRefeicao || m.tipo_refeicao).filter((t: any) => !!t);
        const allTypes = ['CAFE', 'ALMOCO', 'LANCHE', 'JANTAR'];

        let availableType = '';
        if (takenTypes.length > 0) {
          availableType = allTypes.find(t => !takenTypes.includes(t)) || '';
        } else {
          const count = todaysMeals.length;
          if (count < allTypes.length) {
            availableType = allTypes[count];
          }
        }

        if (!availableType) {
          throw new Error('Limite diário atingido. O backend armazena o máximo de 4 refeições agrupadas por dia.');
        }

        // 1. Create a dynamic 'Ingrediente' to hack into the system's strict macro calculation gracefully!
        const ingredientePayload = {
          nome: `${meal.name} (Custom ${Date.now().toString().slice(-4)})`,
          unidadeBase: 'GRAMA',
          kcalPor100: meal.kcal,
          proteinaPor100: meal.protein,
          carboPor100: meal.carbs,
          gorduraPor100: meal.fat
        };

        return this.http.post<any>(`${this.apiUrl}/ingredientes`, ingredientePayload).pipe(
          switchMap((ingrediente) => {
            const ingredienteId = ingrediente.id;

            // 2. Submit 'Refeicao' binding this specific custom ingredient 
            const refeicaoPayload = {
              data: today,
              tipo: availableType, // Use the dynamically selected available type
              itens: [
                {
                  ingredienteId: ingredienteId,
                  quantidade: 100 // 100g applies exactly the macros inserted by the user
                }
              ]
            };
            return this.http.post<any>(`${this.apiUrl}/refeicoes`, refeicaoPayload);
          })
        );
      })
    );
  }

  updateMeal(id: string, meal: Partial<Meal>): Observable<any> {
    throw new Error("Update Refeicao not directly mapped via simple ID. Use local editing fallback if needed.");
  }

  deleteMeal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/refeicoes/${id}`); // Fallback assumption
  }
}
