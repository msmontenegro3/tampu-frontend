import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentStateService {
  private enrolledIds$ = new BehaviorSubject<Set<string>>(new Set());

  // Observable
  readonly enrolled$ = this.enrolledIds$.asObservable();

  // Inicializar estado
  set(ids: string[]) {
    this.enrolledIds$.next(new Set(ids));
  }

  // Actualizacion
  add(eventId: string) {
    const copy = new Set(this.enrolledIds$.value);
    copy.add(eventId);
    this.enrolledIds$.next(copy);
  }

  remove(eventId: string) {
    const copy = new Set(this.enrolledIds$.value);
    copy.delete(eventId);
    this.enrolledIds$.next(copy);
  }

  // Lectura
  isEnrolled$(eventId: string) {
    return this.enrolled$.pipe(map((set) => set.has(eventId)));
  }

  isEnrolledSync$(eventId: string): boolean {
    return this.enrolledIds$.value.has(eventId);
  }
}
