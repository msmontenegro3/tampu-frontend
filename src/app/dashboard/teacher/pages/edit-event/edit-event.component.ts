import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventsService } from '../../../../core/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css',
})
export class EditEventComponent implements OnInit {
  /* ICONS */

  backIcon = faArrowLeft;

  form!: FormGroup;
  loading = false;
  error: string | null = null;
  eventId!: string;

  deleting = false;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    //id
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
    });

    this.loadEvent();
  }

  loadEvent() {
    this.loading = true;

    this.eventsService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.form.patchValue({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el evento';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.eventsService.updateEvent(this.eventId, this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/my-events']);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al actualizar el evento';
        this.loading = false;
      },
    });
  }

  onDelete() {
    if (!this.eventId) return;

    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar este tambo? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    this.deleting = true;

    this.eventsService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.deleting = false;

        this.router.navigate(['/dashboard/my-events']);
      },
      error: (err) => {
        console.error('Error al eliminar el evento', err);
        this.deleting = false;
        alert('No se pudo eliminar el tambo. Inténtalo de nuevo');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
