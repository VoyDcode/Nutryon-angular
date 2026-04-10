import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthState } from '../models/types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private initialState: AuthState = {
    user: null,
    token: localStorage.getItem('nutryon_token'),
    isAuthenticated: !!localStorage.getItem('nutryon_token'),
    isLoading: true,
  };

  private authState = new BehaviorSubject<AuthState>(this.initialState);
  public authState$ = this.authState.asObservable();

  constructor(private router: Router) {
    this.initAuth();
  }

  private initAuth() {
    const storedUser = localStorage.getItem('nutryon_user');
    const token = this.authState.value.token;

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.authState.next({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (e) {
        this.logout();
      }
    } else {
      this.authState.next({ ...this.authState.value, isLoading: false });
    }
  }

  login(token: string, user: User) {
    localStorage.setItem('nutryon_token', token);
    localStorage.setItem('nutryon_user', JSON.stringify(user));
    
    this.authState.next({
      token,
      user,
      isAuthenticated: true,
      isLoading: false
    });
  }

  logout() {
    localStorage.removeItem('nutryon_token');
    localStorage.removeItem('nutryon_user');
    
    this.authState.next({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    this.router.navigate(['/login']);
  }

  updateUser(user: User) {
    localStorage.setItem('nutryon_user', JSON.stringify(user));
    const currentState = this.authState.value;
    this.authState.next({ ...currentState, user });
  }

  get currentUser(): User | null {
    return this.authState.value.user;
  }

  get currentToken(): string | null {
    return this.authState.value.token;
  }

  get isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }
}
