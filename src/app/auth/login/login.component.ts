import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.authService.saveToken(res.access_token);

          // Identifica el rol
          const payload = JSON.parse(atob(res.access_token.split('.')[1]));
          if (payload.rol === 'docente') this.router.navigate(['/teacher']);
          else this.router.navigate(['/student']);
        },

        error: (err) => {
          this.loading = false;
          this.errorMessage = `Error: ${err}`;
        },
      });
  }
}
