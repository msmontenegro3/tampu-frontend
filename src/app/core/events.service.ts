import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiURL = `${environment.apiUrl}/events`; //backend nestjs
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiURL}`);
  }

  getEventById(id: string) {
    return this.http.get<Event>(`${this.apiURL}/${id}`);
  }
}
