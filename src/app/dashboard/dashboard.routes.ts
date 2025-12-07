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
    ],
  },
];
