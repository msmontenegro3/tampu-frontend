import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

interface JwtPayload {
  sub: number;
  email: string;
  rol: 'docente' | 'estudiante';
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  constructor(private authService: AuthService) {}

  private decodeToken(): JwtPayload | null {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      const [, payload] = token.split('.');

      const json = atob(payload);

      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getCurrentUser(): JwtPayload | null {
    return this.decodeToken();
  }

  getCurrentUserId(): number | null {
    return this.decodeToken()?.sub ?? null;
  }

  getCurrentUserRole(): string | null {
    return this.decodeToken()?.rol ?? null;
  }

  getCurrentUserEmail(): string | null {
    return this.decodeToken()?.email ?? null;
  }
}
