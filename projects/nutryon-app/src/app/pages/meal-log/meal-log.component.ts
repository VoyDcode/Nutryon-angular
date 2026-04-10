import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Plus, Search, Edit2, Trash2, X, Check } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { Meal } from '../../core/models/types';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-meal-log',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, BottomNavComponent],
  templateUrl: './meal-log.component.html'
})
export class MealLogComponent implements OnInit {
  meals: Meal[] = [];
  isLoading = true;
  isModalOpen = false;
  editingMeal: Meal | null = null;
  
  formData = {
    name: '',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Icons
  ChevronLeftIcon = ChevronLeft;
  PlusIcon = Plus;
  SearchIcon = Search;
  Edit2Icon = Edit2;
  Trash2Icon = Trash2;
  XIcon = X;
  CheckIcon = Check;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchMeals();
  }

  fetchMeals(): void {
    this.isLoading = true;
    this.apiService.getMeals().subscribe({
      next: (data) => {
        this.meals = data;
        this.isLoading = false;
      },
      error: () => {
        // Fallback or empty state if API fails
        this.meals = [];
        this.isLoading = false;
      }
    });
  }
  
  handleOpenModal(meal?: Meal): void {
    if (meal) {
      this.editingMeal = meal;
      this.formData = {
        name: meal.name,
        kcal: meal.kcal,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat
      };
    } else {
      this.editingMeal = null;
      this.formData = { name: '', kcal: 0, protein: 0, carbs: 0, fat: 0 };
    }
    this.isModalOpen = true;
  }

  handleCloseModal(): void {
    this.isModalOpen = false;
  }

  handleSubmit(): void {
    if (this.editingMeal) {
      this.apiService.updateMeal(this.editingMeal.id, this.formData).subscribe({
        next: () => this.fetchMeals(),
        error: () => {
          alert("Não é possível editar refeições antigas no esquema atual.");
          this.handleCloseModal();
        }
      });
    } else {
      this.apiService.createMeal(this.formData).subscribe({
        next: () => {
          this.fetchMeals();
          this.handleCloseModal();
        },
        error: (err) => {
          alert(err.message || 'Erro ao salvar a refeição. Você atingiu o limite?');
          this.handleCloseModal();
        }
      });
    }
  }

  handleDelete(id: string): void {
    if (confirm('Deseja excluir esta refeição?')) {
      this.apiService.deleteMeal(id).subscribe({
        next: () => this.fetchMeals(),
        error: () => {
          this.meals = this.meals.filter(m => m.id !== id);
        }
      });
    }
  }
}
