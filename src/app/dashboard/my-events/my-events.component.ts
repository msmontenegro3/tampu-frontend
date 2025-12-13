import { Component, OnInit } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { EventsService } from '../../core/events.service';
import { AuthHelperService } from '../../core/auth-helper.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css',
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  currentUserId: number | null = null;

  constructor(
    private eventsService: EventsService,
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

  loadMyEvents() {
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
}
