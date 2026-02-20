import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const shopGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);
  
  const role = authService.getRole(); 
  
  if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
    router.navigate(['/admin/dashboard']); 
    return false;
  }
  
  return true; 
};