import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventsService } from '../../../../core/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
})
export class CreateEventComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.eventsService.createEvent(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/my-events']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo crear el tambo';
        this.loading = false;
      },
    });
  }
}
