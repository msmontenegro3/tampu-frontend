import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TeacherComponent } from './dashboard/teacher/teacher.component';
import { StudentComponent } from './dashboard/student/student.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [authGuard],
    data: { rol: 'docente' },
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [authGuard],
    data: { rol: 'estudiante' },
  },
];
