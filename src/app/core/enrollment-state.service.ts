import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentStateService {
  private enrolledIdsSubject = new BehaviorSubject<Set<string>>(new Set());
  enrolledIds$ = this.enrolledIdsSubject.asObservable();

  // Inicializar estado
  set(ids: string[]) {
    this.enrolledIdsSubject.next(new Set(ids));
  }

  // Lectura
  isEnrolled(eventId: string): boolean {
    return this.enrolledIdsSubject.value.has(eventId);
  }

  // Actualizacion
  add(eventId: string) {
    const copy = new Set(this.enrolledIdsSubject.value);
    copy.add(eventId);
    this.enrolledIdsSubject.next(copy);
  }

  remove(eventId: string) {
    const copy = new Set(this.enrolledIdsSubject.value);
    copy.delete(eventId);
    this.enrolledIdsSubject.next(copy);
  }
}
