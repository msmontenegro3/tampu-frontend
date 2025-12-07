import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../core/events.service';
import { Event } from '../../core/models/event.model';
import { CommonModule } from '@angular/common';
import { AuthHelperService } from '../../core/auth-helper.service';
import { EnrollmentsService } from '../../core/enrollments.service';
import { EnrollmentStateService } from '../../core/enrollment-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  currentUserId: number | null = null;
  currentUserRole: string | null = null;

  constructor(
    private eventsService: EventsService,
    private authHelperService: AuthHelperService,
    private enrollmentsService: EnrollmentsService,
    private enrollmentState: EnrollmentStateService
  ) {}

  ngOnInit(): void {
    const user = this.authHelperService.getCurrentUser();

    this.currentUserId = user?.sub ?? null;
    this.currentUserRole = user?.rol ?? null;

    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;

        if (this.currentUserRole === 'estudiante') {
          this.loadEnrollments();
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'No se pudieron cargar los eventos.';
        this.loading = false;
      },
    });
  }

  isOwner(event: Event): boolean {
    return (
      this.currentUserRole === 'docente' &&
      event.teacher?.id === this.currentUserId
    );
  }

  isStudent(): boolean {
    return this.currentUserRole === 'estudiante';
  }

  isEnrolled(eventId: string): boolean {
    return this.enrollmentState.isEnrolled(eventId);
  }

  isPast(date: string): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return date < today;
  }

  loadEnrollments(): void {
    this.enrollmentsService.getMyEnrollments().subscribe({
      next: (ids: string[]) => {
        this.enrollmentState.set(ids);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleEnrollment(event: Event): void {
    if (this.enrollmentState.isEnrolled(event.id)) {
      this.enrollmentsService.unenroll(event.id).subscribe({
        next: () => this.enrollmentState.remove(event.id),
      });
    } else {
      this.enrollmentsService.enroll(event.id).subscribe({
        next: () => this.enrollmentState.add(event.id),
        error: (err) => {
          console.error('Error al inscribirse', err);
        },
      });
    }
  }
}
