import { Routes } from '@angular/router';
import { authGuard } from '../core/auth.guard';
import { AttendanceComponent } from './attendance/attendance.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { ProfileComponent } from './profile/profile.component';
import { MyEnrollmentsComponent } from './my-enrollments/my-enrollments.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'my-events', component: MyEventsComponent },
      { path: 'my-enrollments', component: MyEnrollmentsComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'events/:id', component: EventDetailComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'teacher/create',
        loadComponent: () =>
          import('./teacher/pages/create-event/create-event.component').then(
            (m) => m.CreateEventComponent
          ),
        canActivate: [authGuard],
        data: { rol: 'docente' },
      },
      {
        path: 'teacher/edit-event/:id',
        loadComponent: () =>
          import('./teacher/pages/edit-event/edit-event.component').then(
            (m) => m.EditEventComponent
          ),
        canActivate: [authGuard],
        data: { rol: 'docente' },
      },
      {
        path: 'attendance/event/:id',
        loadComponent: () =>
          import(
            './attendance/pages/event-attendance/event-attendance.component'
          ).then((m) => m.EventAttendanceComponent),
        canActivate: [authGuard],
        data: { rol: 'docente' },
      },
    ],
  },
];
