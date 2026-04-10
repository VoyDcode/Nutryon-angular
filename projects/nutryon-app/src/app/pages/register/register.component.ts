import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, ArrowRight } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.error = '';
    const data = this.registerForm.value;

    this.apiService.register(data).subscribe({
      next: () => {
        // Automatically login after successful registration since backend returns 200 OK
        this.apiService.login({ email: data.email, senha: data.password }).subscribe({
           next: (res: any) => {
              const mockUser = { 
                id: '1', name: data.name, email: data.email, 
                gender: null as any, age: 25, height: 175, weight: 75, 
                activityLevel: null as any, goal: null as any
              };
              this.authService.login(res.token, mockUser);
              this.router.navigate(['/onboarding']);
              this.isLoading = false;
           },
           error: () => {
              this.router.navigate(['/login']);
              this.isLoading = false;
           }
        });
      },
      error: (err) => {
        this.error = 'O e-mail já está em uso ou ocorreu um erro na requisição.';
        this.isLoading = false;
      }
    });
  }
}
