import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut, ChevronLeft, Save, CheckCircle2 } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/types';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, BottomNavComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  formData = {
    name: '',
    email: '',
    age: 0,
    height: 0,
    weight: 0
  };
  
  isSaved = false;
  isPending = false;

  // Icons
  LogOutIcon = LogOut;
  ChevronLeftIcon = ChevronLeft;
  SaveIcon = Save;
  CheckCircle2Icon = CheckCircle2;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user) {
      this.formData = {
        name: this.user.name || '',
        email: this.user.email || '',
        age: this.user.age || 0,
        height: this.user.height || 0,
        weight: this.user.weight || 0
      };
    }
  }

  logout(): void {
    this.authService.logout();
  }

  handleSubmit(): void {
    this.isPending = true;
    // Save profile data locally (backend doesn't have profile update endpoint yet)
    const updatedUser = { ...this.user, ...this.formData } as User;
    this.authService.updateUser(updatedUser);
    this.user = updatedUser;
    this.showSavedMessage();
  }

  showSavedMessage(): void {
    this.isPending = false;
    this.isSaved = true;
    setTimeout(() => {
      this.isSaved = false;
    }, 3000);
  }
}
