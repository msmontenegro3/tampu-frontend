import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  //console.log('Guard evaluando:', route.routeConfig?.path);

  const token = auth.getToken();

  if (!token) {
    router.navigate(['/login']);
    console.warn('🚫 No hay token, redirigiendo al login');
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    //console.log('Token payload:', payload);
    const rolRequerido = route.data?.['rol'];

    if (rolRequerido && payload.rol !== rolRequerido) {
      console.warn(`⚠ Rol ${payload.rol} no autorizado para ${rolRequerido}`);
      router.navigate(['/login']);
      return false;
    }
  } catch (err) {
    console.error('Token inválido', err);
    router.navigate(['/login']);
    return false;
  }

  //console.log('Acceso permitido a:', route.routeConfig?.path);
  return true;
};
