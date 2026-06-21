import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API_URL } from './api.config';

// Endpoints whose 401 must NOT trigger a refresh (they ARE the auth flow).
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApi = req.url.startsWith(API_URL);
  // Send cookies on every backend call.
  const apiReq = isApi ? req.clone({ withCredentials: true }) : req;
  const auth = inject(AuthService);

  return next(apiReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const shouldRefresh =
        err.status === 401 &&
        isApi &&
        !NO_REFRESH.some((path) => apiReq.url.includes(path));

      if (!shouldRefresh) {
        return throwError(() => err);
      }

      // Access token expired → get a new pair, then replay the failed request.
      return auth.refreshTokens().pipe(
        switchMap(() => next(apiReq)),
        catchError((refreshErr) => {
          // Refresh itself failed → session is dead.
          void auth.logout();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
