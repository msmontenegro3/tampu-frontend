import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  errorMessage = '';
  successMessage = '';
  loading = false;

  registerForm = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      rol: ['', [Validators.required]],
    },
    {
      validators: this.passwordsMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  passwordsMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { nombre, email, password, rol } = this.registerForm.value;

    this.authService.register({ nombre, email, password, rol }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registro exitoso. Ya puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al registrar. El correo ya está registrado';
      },
    });
  }

  // Getters
  get nombre() {
    return this.registerForm.get('nombre');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get rol() {
    return this.registerForm.get('rol');
  }
}
