import { Component, OnInit } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { EventsService } from '../../core/events.service';
import { Router } from '@angular/router';
import { AuthHelperService } from '../../core/auth-helper.service';
import { CommonModule } from '@angular/common';
import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  /* ICONS */
  dateIcon = faCalendar;
  placeIcon = faLocationDot;

  events: Event[] = [];
  loading = false;
  error: string | null = null;

  currentUserId: number | null = null;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private authHelperService: AuthHelperService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authHelperService.getCurrentUser()?.sub ?? null;

    if (!this.currentUserId) {
      this.error = 'No se pudo obtener el usuario actual';
      return;
    }
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.loading = true;

    this.eventsService.getAllEvents().subscribe({
      next: (allEvents) => {
        this.events = allEvents.filter(
          (e) => e.teacher?.id === this.currentUserId
        );

        this.loading = false;
      },
      error: () => {
        (this.error = 'Error al cargar los eventos'), (this.loading = false);
      },
    });
  }

  goToEvent(eventId: string) {
    this.router.navigate(['/dashboard/attendance/event', eventId]);
  }
}
