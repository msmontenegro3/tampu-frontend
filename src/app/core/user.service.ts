import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiURL}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiURL}/profile`, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiURL}/profile`);
  }
}
