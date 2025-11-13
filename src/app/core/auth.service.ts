import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = `${environment.apiUrl}/auth`; //backend nestjs
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, data);
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
