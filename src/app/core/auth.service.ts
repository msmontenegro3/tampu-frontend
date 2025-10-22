import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = 'http://localhost:3000/auth'; //backend nestjs
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
    return localStorage.getItem('access_toke');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
