import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Make sure the session is loaded before checking the role (e.g. on a hard
  // page load where fetchMe hasn't run yet).
  if (!auth.currentUser()) {
    await auth.fetchMe();
  }

  const role = auth.currentUser()?.role;
  if (role === 'admin' || role === 'owner') {
    return true;
  }
  return router.parseUrl('/access-denied');
};
