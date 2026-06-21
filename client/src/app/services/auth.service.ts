import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, firstValueFrom, Observable, shareReplay } from 'rxjs';
import { API_URL } from '../core/api.config';

export type AuthTab = 'login' | 'register' | 'reset';

export interface AuthUser {
  id: string;
  userName: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${API_URL}/auth`;

  // Modal UI state
  readonly open = signal(false);
  readonly tab = signal<AuthTab>('login');

  // Session state
  readonly currentUser = signal<AuthUser | null>(null);
  readonly loggedIn = computed(() => this.currentUser() !== null);

  show(tab: AuthTab = 'login'): void {
    this.tab.set(tab);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  async login(payload: LoginPayload): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.base}/login`, payload, { withCredentials: true }),
    );
    await this.fetchMe();
    this.close();
  }

  async register(payload: RegisterPayload): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.base}/register`, payload, {
        withCredentials: true,
      }),
    );
    await this.fetchMe();
    this.close();
  }

  /** Loads the current user from the cookie session; clears state on failure. */
  async fetchMe(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<AuthUser>(`${this.base}/me`, { withCredentials: true }),
      );
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    }
  }

  /**
   * Refreshes the token pair. Concurrent callers share one in-flight request
   * (shareReplay) so a burst of 401s triggers only a single /refresh call.
   */
  refreshTokens(): Observable<unknown> {
    this.refresh$ ??= this.http
      .post(`${this.base}/refresh`, {}, { withCredentials: true })
      .pipe(
        shareReplay(1),
        finalize(() => (this.refresh$ = null)),
      );
    return this.refresh$;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.base}/logout`, {}, { withCredentials: true }),
      );
    } finally {
      this.currentUser.set(null);
      // Always return to the home page after signing out.
      void this.router.navigateByUrl('/');
    }
  }

  private refresh$: Observable<unknown> | null = null;
}
