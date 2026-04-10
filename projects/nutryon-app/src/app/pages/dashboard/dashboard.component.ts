import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, Plus, CheckCircle2 } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Meal } from '../../core/models/types';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BottomNavComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user: any;
  meals: Meal[] = [];
  isLoading = true;

  // Icons
  CalendarIcon = Calendar;
  PlusIcon = Plus;
  CheckCircle2Icon = CheckCircle2;

  consumedKcal = 0;
  targetKcal = 2200;
  progress = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.targetKcal = this.user?.tdee || 2200;

    // Fetch meals to display historical list below
    this.apiService.getMeals().subscribe({
      next: (data) => {
        this.meals = data;
        this.isLoading = false;
      },
      error: () => {
        this.meals = [];
        this.isLoading = false;
      }
    });

    // Fetch accurate macro summary directly from backend logic for today
    const today = new Date().toISOString().split('T')[0];
    this.apiService.getDashboardSummary(today).subscribe({
      next: (summary) => {
        this.consumedKcal = summary.kcal || 0;
        this.progress = (this.consumedKcal / this.targetKcal) * 100;
        this.stats = {
          proteina: summary.proteina || 0,
          carbo: summary.carbo || 0,
          gordura: summary.gordura || 0
        };
      },
      error: () => {
        this.consumedKcal = 0;
        this.progress = 0;
      }
    });
  }

  stats = { proteina: 0, carbo: 0, gordura: 0 };

  get macros() {
    return [
      { label: 'Proteínas', val: `${this.stats.proteina}g`, target: '150g', progress: (this.stats.proteina / 150) * 100, color: 'bg-primary', msg: `Bateu ${Math.round(this.stats.proteina)}g` },
      { label: 'Carboidratos', val: `${this.stats.carbo}g`, target: '300g', progress: (this.stats.carbo / 300) * 100, color: 'bg-secondary', msg: `Bateu ${Math.round(this.stats.carbo)}g` },
      { label: 'Gorduras', val: `${this.stats.gordura}g`, target: '80g', progress: (this.stats.gordura / 80) * 100, color: 'bg-tertiary', msg: `Bateu ${Math.round(this.stats.gordura)}g` }
    ];
  }

  getFirstWord(name: string | undefined): string {
    return name ? name.split(' ')[0] : 'Usuário';
  }
}
