import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private apiURL = `${environment.apiUrl}/enrollments`; //backend nestjs
  constructor(private http: HttpClient) {}

  enroll(eventId: string) {
    return this.http.post(`${this.apiURL}/${eventId}`, {});
  }

  unenroll(eventId: string) {
    return this.http.delete(`${this.apiURL}/${eventId}`);
  }

  getMyEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/my-events`);
  }

  isEnrolled(eventId: string) {
    return this.http.get<{ enrolled: boolean }>(
      `${this.apiURL}/event/${eventId}/is-enrolled`
    );
  }
}
