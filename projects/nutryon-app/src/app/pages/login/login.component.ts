import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, ArrowRight } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  error = '';
  
  // Lucide icons
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;
  ArrowRightIcon = ArrowRight;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';
    const credentials = this.loginForm.value;

    this.apiService.login(credentials).subscribe({
      next: (response: any) => {
        // Since Backend doesn't return full user profile, we reconstruct a local mock associated with the email
        const token = response.token;
        const mockUser = { 
          id: '1', name: 'Membro Nutryon', email: credentials.email, 
          gender: 'male' as const, age: 25, height: 175, weight: 75, 
          activityLevel: 'moderate' as const, goal: 'maintain' as const 
        };
        this.authService.login(token, mockUser);
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        this.isLoading = false;
      }
    });
  }
}
