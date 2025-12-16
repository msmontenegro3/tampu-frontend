import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiURL = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  listByEvent(eventId: string) {
    return this.http.get<any[]>(`${this.apiURL}/event/${eventId}`);
  }

  getEventAttendance(eventId: string) {
    return this.http.get<any[]>(`${this.apiURL}/event/${eventId}`);
  }

  markAttendance(eventId: string, studentId: number) {
    return this.http.post(`${this.apiURL}/${eventId}/${studentId}`, {});
  }

  removeAttendance(eventId: string, studentId: number) {
    return this.http.delete(`${this.apiURL}/${eventId}/${studentId}`, {});
  }
}
