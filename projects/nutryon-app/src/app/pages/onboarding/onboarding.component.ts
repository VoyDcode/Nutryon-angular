import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ArrowRight, User, CheckCircle2 } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Gender, ActivityLevel, Goal } from '../../core/models/types';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit {
  step = 1;
  totalSteps = 6;
  
  data: {
    gender: Gender | null;
    age: number;
    height: number;
    weight: number;
    activityLevel: ActivityLevel | null;
    goal: Goal | null;
  } = {
    gender: null,
    age: 25,
    height: 175,
    weight: 75,
    activityLevel: null,
    goal: null
  };

  // Icons
  ChevronLeftIcon = ChevronLeft;
  ArrowRightIcon = ArrowRight;
  UserIcon = User;
  CheckCircle2Icon = CheckCircle2;

  activityOptions = [
    { id: 'low', title: 'Baixo', desc: 'Sedentário, pouco movimento.' },
    { id: 'moderate', title: 'Moderado', desc: 'Atividade leve, caminha ocasionalmente.' },
    { id: 'high', title: 'Alto', desc: 'Ativo, pratica exercícios regularmente.' },
    { id: 'very_high', title: 'Muito Alto', desc: 'Treinos intensos diários.' }
  ];

  goalOptions = [
    { id: 'lose', title: 'Perder peso', desc: '-20% calorias' },
    { id: 'maintain', title: 'Manter o peso', desc: '0% calorias' },
    { id: 'gain', title: 'Aumentar o peso', desc: '+20% calorias' }
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.data.gender = user.gender;
      this.data.age = user.age || 25;
      this.data.height = user.height || 175;
      this.data.weight = user.weight || 75;
      this.data.activityLevel = user.activityLevel;
      this.data.goal = user.goal;
    }
  }

  get progress(): number {
    return (this.step / this.totalSteps) * 100;
  }

  isNextDisabled(): boolean {
    if (this.step === 1 && !this.data.gender) return true;
    if (this.step === 5 && !this.data.activityLevel) return true;
    if (this.step === 6 && !this.data.goal) return true;
    return false;
  }

  nextStep(): void {
    if (this.step === 6) {
      this.handleFinish();
    } else {
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  updateField(field: string, value: any): void {
    (this.data as any)[field] = value;
  }

  handleFinish(): void {
    const defaultUser = this.authService.currentUser || {} as any;
    const finalData = {
      ...defaultUser,
      ...this.data,
      tdee: 2500,
      macros: { protein: 150, carbs: 300, fat: 80 }
    };

    // Save profile info locally because backend DB lacks extra columns
    this.authService.updateUser(finalData);
    this.router.navigate(['/']);
  }
}
