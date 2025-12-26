import { Component, OnInit } from '@angular/core';
import { EnrollmentsService } from '../../core/enrollments.service';
import { EventsService } from '../../core/events.service';
import { EnrollmentStateService } from '../../core/enrollment-state.service';
import { Event } from '../../core/models/event.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './my-enrollments.component.html',
  styleUrl: './my-enrollments.component.css',
})
export class MyEnrollmentsComponent implements OnInit {
  /* ÍCONOS FONT AWESOME */
  dateIcon = faCalendar;
  placeIcon = faLocationDot;

  events: Event[] = [];
  loading = false;

  constructor(
    private enrollmentsService: EnrollmentsService,
    private eventsService: EventsService,
    private enrollmentState: EnrollmentStateService
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.loading = true;

    this.enrollmentsService.getMyEnrollments().subscribe({
      next: (ids: string[]) => {
        this.events = [];

        ids.forEach((id) => {
          this.eventsService.getEventById(id).subscribe({
            next: (event) => this.events.push(event),
          });
        });

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  isEnrolled$(id: string): Observable<boolean> {
    return this.enrollmentState.isEnrolled$(id);
  }

  toggleEnrollment(event: Event): void {
    const isEnrolled = this.enrollmentState.isEnrolledSync$(event.id);

    if (isEnrolled) {
      this.enrollmentsService.unenroll(event.id).subscribe({
        next: () => {
          this.enrollmentState.remove(event.id);

          this.enrollmentsService.getMyEnrollments().subscribe((ids) => {
            this.enrollmentState.set(ids);
          });

          this.events = this.events.filter((e) => e.id !== event.id);
        },
      });
    } else {
      this.enrollmentsService.enroll(event.id).subscribe({
        next: () => this.enrollmentState.add(event.id),
      });
    }
  }
}
