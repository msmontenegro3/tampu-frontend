import { Component, OnInit } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventsService } from '../../core/events.service';
import { AuthHelperService } from '../../core/auth-helper.service';
import { CommonModule } from '@angular/common';
import { EnrollmentsService } from '../../core/enrollments.service';
import { EnrollmentStateService } from '../../core/enrollment-state.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  error: string | null = null;

  isEnrolled$!: Observable<boolean>;

  currentUserId: number | null = null;
  currentUserRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private authHelperService: AuthHelperService,
    private enrollmentsService: EnrollmentsService,
    private enrollmentState: EnrollmentStateService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authHelperService.getCurrentUser()?.sub ?? null;
    this.currentUserRole = this.authHelperService.getCurrentUser()?.rol ?? null;

    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string): void {
    this.loading = true;

    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;

        this.isEnrolled$ = this.enrollmentState.isEnrolled$(event.id);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el evento.';
        this.loading = false;
      },
    });
  }

  isOwner(): boolean {
    return (
      this.authHelperService.getCurrentUserRole() === 'docente' &&
      this.event?.teacher?.id === this.currentUserId
    );
  }

  isStudent(): boolean {
    return this.currentUserRole === 'estudiante';
  }

  isPast(date: string): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return date < today;
  }

  toggleEnrollment(): void {
    if (!this.event) return;

    const eventId = this.event.id;

    this.enrollmentState
      .isEnrolled$(eventId)
      .pipe(take(1))
      .subscribe((enrolled) => {
        if (enrolled) {
          this.enrollmentsService.unenroll(eventId).subscribe({
            next: () => this.enrollmentState.remove(eventId),
            error: () => alert('No se pudo desinscribir'),
          });
        } else {
          this.enrollmentsService.enroll(eventId).subscribe({
            next: () => this.enrollmentState.add(eventId),
            error: (err) => {
              if (err.status === 409) alert(err.error.message);
              else alert('Error al inscribirse');
            },
          });
        }
      });
  }
}
