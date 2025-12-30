import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentsService } from '../../../../core/enrollments.service';
import { AttendanceService } from '../../../../core/attendance.service';
import { EventsService } from '../../../../core/events.service';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event-attendance',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './event-attendance.component.html',
  styleUrl: './event-attendance.component.css',
})
export class EventAttendanceComponent implements OnInit {
  /* ICONOS */
  backIcon = faArrowLeft;

  eventId!: string;
  eventName!: string;
  students: any[] = [];
  attendanceMap = new Set<string>();
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private enrollmentsService: EnrollmentsService,
    private attendanceService: AttendanceService,
    private eventsService: EventsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.loadEventData();
    this.loadStudents();
  }

  loadEventData() {
    this.eventsService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventName = event.title;
      },
      error: () => {
        this.eventName = 'Evento no encontrado';
      },
    });
  }

  loadStudents() {
    this.loading = true;

    // 1️⃣ Obtener estudiantes inscritos
    this.enrollmentsService.getByEvent(this.eventId).subscribe({
      next: (records) => {
        this.students = records.map((r: any) => r.student);

        // 2️⃣ Obtener asistencias registradas
        this.attendanceService.getEventAttendance(this.eventId).subscribe({
          next: (att) => {
            att.forEach((a: any) =>
              this.attendanceMap.add(a.student.id.toString())
            );
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isPresent(studentId: number): boolean {
    return this.attendanceMap.has(studentId.toString());
  }

  toggle(studentId: number) {
    const key = studentId.toString();

    if (this.attendanceMap.has(key)) {
      this.attendanceService
        .removeAttendance(this.eventId, studentId)
        .subscribe({
          next: () => this.attendanceMap.delete(key),
        });
    } else {
      this.attendanceService.markAttendance(this.eventId, studentId).subscribe({
        next: () => this.attendanceMap.add(key),
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
