import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage = '';
  loading = false;

  //Formulario reactivo

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.authService.saveToken(res.access_token);

        // Identifica el rol
        const payload = JSON.parse(atob(res.access_token.split('.')[1]));

        if (payload.rol === 'docente') {
          this.router.navigate(['/teacher']);
          console.log('dirigiendo al docente');
        } else {
          this.router.navigate(['/student']);
          console.log('dirigiendo al estudiante');
        }
      },

      error: (err) => {
        this.loading = false;
        this.errorMessage = `Error: ${err}`;
      },
    });
  }

  // Getters

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
