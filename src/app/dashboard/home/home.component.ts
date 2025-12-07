import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../core/events.service';
import { Event } from '../../core/models/event.model';
import { CommonModule } from '@angular/common';
import { AuthHelperService } from '../../core/auth-helper.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    private authHelperService: AuthHelperService
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
      next: (data) => {
        this.events = data;
        this.loading = false;
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
}
