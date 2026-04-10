import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Calendar, TrendingUp, Target } from 'lucide-angular';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BottomNavComponent],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  // Icons
  ChevronLeftIcon = ChevronLeft;
  CalendarIcon = Calendar;
  TrendingUpIcon = TrendingUp;
  TargetIcon = Target;

  calorieData = [
    { day: 'Seg', kcal: 2100 },
    { day: 'Ter', kcal: 2300 },
    { day: 'Qua', kcal: 1950 },
    { day: 'Qui', kcal: 2200 },
    { day: 'Sex', kcal: 2500 },
    { day: 'Sáb', kcal: 2800 },
    { day: 'Dom', kcal: 2400 }
  ];

  weightData = [
    { day: '01/04', kg: 76.5 },
    { day: '08/04', kg: 76.2 },
    { day: '15/04', kg: 75.8 },
    { day: '22/04', kg: 75.5 },
    { day: '29/04', kg: 75.0 }
  ];

  maxKcal = 3000;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Optionally fetch historical data
  }

  getBarHeight(kcal: number): string {
    return `${(kcal / this.maxKcal) * 100}%`;
  }
}
