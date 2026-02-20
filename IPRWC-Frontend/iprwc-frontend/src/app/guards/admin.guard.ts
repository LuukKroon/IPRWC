import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);
  
  const role = authService.getRole();
  
  if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};