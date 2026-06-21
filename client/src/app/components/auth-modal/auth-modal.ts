import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthTab } from '../../services/auth.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-auth-modal',
  imports: [FormsModule, IconComponent],
  template: `
    @if (auth.open()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        (mousedown)="onBackdropMouseDown($event)"
        (click)="onBackdropClick($event)"
      >
        <div
          class="auth-card relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-2 p-6 shadow-2xl sm:p-8"
        >
          <button
            type="button"
            (click)="auth.close()"
            aria-label="Close"
            class="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
          >
            <app-icon name="close" class="text-lg" />
          </button>

          <div class="flex items-center justify-center gap-2">
            <img src="ico/main.png" alt="" class="h-9 w-9 rounded-full" />
            <span class="text-lg font-bold text-brand-gradient">UnityLands</span>
          </div>

          <!-- Tabs -->
          <div class="mt-6 flex border-b border-white/10">
            @for (t of tabs; track t.id) {
              <button
                type="button"
                (click)="switchTab(t.id)"
                class="relative flex-1 pb-3 text-sm font-medium transition-all duration-200"
                [class]="
                  auth.tab() === t.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                "
              >
                {{ t.label }}
                @if (auth.tab() === t.id) {
                  <span
                    class="absolute -bottom-px left-0 h-0.5 w-full bg-brand-gradient"
                  ></span>
                }
              </button>
            }
          </div>

          <!-- Error -->
          @if (error()) {
            <div
              class="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400"
            >
              {{ error() }}
            </div>
          }

          <!-- Forms -->
          <form (ngSubmit)="submit()" class="mt-5 space-y-3">
            @switch (auth.tab()) {
              @case ('login') {
                <input
                  name="login"
                  type="text"
                  placeholder="Логін"
                  class="auth-input"
                  [(ngModel)]="loginId"
                />
                <div class="relative">
                  <input
                    name="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    placeholder="Пароль"
                    class="auth-input pr-16"
                    [(ngModel)]="password"
                  />
                  @if (password) {
                    <button
                      type="button"
                      (click)="copy(password)"
                      aria-label="Копіювати пароль"
                      title="Копіювати"
                      class="absolute right-9 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      [attr.aria-label]="
                        showPassword() ? 'Сховати пароль' : 'Показати пароль'
                      "
                      class="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      @if (showPassword()) {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="m2 2 20 20" />
                          <path
                            d="M6.7 6.7C4 8.3 2 12 2 12s3.5 7 10 7c2 0 3.8-.6 5.3-1.4"
                          />
                          <path
                            d="M9.9 4.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-2.3 3.2"
                          />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      } @else {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      }
                    </button>
                  }
                </div>
                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  [disabled]="submitting()"
                >
                  {{ submitting() ? 'Вхід…' : 'Увійти' }}
                </button>
              }
              @case ('register') {
                <input
                  name="userName"
                  type="text"
                  placeholder="Нікнейм"
                  class="auth-input"
                  [(ngModel)]="userName"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  class="auth-input"
                  [(ngModel)]="email"
                />
                <div class="relative">
                  <input
                    name="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    placeholder="Пароль"
                    class="auth-input pr-16"
                    [(ngModel)]="password"
                  />
                  @if (password) {
                    <button
                      type="button"
                      (click)="copy(password)"
                      aria-label="Копіювати пароль"
                      title="Копіювати"
                      class="absolute right-9 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      [attr.aria-label]="
                        showPassword() ? 'Сховати пароль' : 'Показати пароль'
                      "
                      class="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      @if (showPassword()) {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="m2 2 20 20" />
                          <path
                            d="M6.7 6.7C4 8.3 2 12 2 12s3.5 7 10 7c2 0 3.8-.6 5.3-1.4"
                          />
                          <path
                            d="M9.9 4.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-2.3 3.2"
                          />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      } @else {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      }
                    </button>
                  }
                </div>
                <div class="relative">
                  <input
                    name="confirm"
                    [type]="showConfirm() ? 'text' : 'password'"
                    placeholder="Повторіть пароль"
                    class="auth-input pr-16"
                    [(ngModel)]="confirm"
                  />
                  @if (confirm) {
                    <button
                      type="button"
                      (click)="copy(confirm)"
                      aria-label="Копіювати пароль"
                      title="Копіювати"
                      class="absolute right-9 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      (click)="showConfirm.set(!showConfirm())"
                      [attr.aria-label]="
                        showConfirm() ? 'Сховати пароль' : 'Показати пароль'
                      "
                      class="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      @if (showConfirm()) {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="m2 2 20 20" />
                          <path
                            d="M6.7 6.7C4 8.3 2 12 2 12s3.5 7 10 7c2 0 3.8-.6 5.3-1.4"
                          />
                          <path
                            d="M9.9 4.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-2.3 3.2"
                          />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      } @else {
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      }
                    </button>
                  }
                </div>
                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  [disabled]="submitting()"
                >
                  {{ submitting() ? 'Створення…' : 'Створити акаунт' }}
                </button>
                <p class="pt-1 text-center text-xs text-gray-500">
                  Реєструючись, ви приймаєте правила сервера.
                </p>
              }
            }
          </form>

          <!--
            Social login and password reset are intentionally hidden for now —
            their backends don't exist yet. Restore from git history when ready.
          -->
        </div>
      </div>
    }
  `,
})
export class AuthModal {
  protected readonly auth = inject(AuthService);

  protected loginId = '';
  protected userName = '';
  protected email = '';
  protected password = '';
  protected confirm = '';

  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirm = signal(false);

  // 'reset' is omitted until the reset-password flow exists.
  protected readonly tabs: { id: AuthTab; label: string }[] = [
    { id: 'login', label: 'Вхід' },
    { id: 'register', label: 'Реєстрація' },
  ];

  // Tracks whether a click sequence actually started on the backdrop, so that
  // selecting text inside the card and releasing outside does NOT close it.
  private pressedOnBackdrop = false;

  constructor() {
    // Clear the form whenever the modal is closed.
    effect(() => {
      if (!this.auth.open()) {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.loginId = '';
    this.userName = '';
    this.email = '';
    this.password = '';
    this.confirm = '';
    this.error.set(null);
    this.submitting.set(false);
    this.showPassword.set(false);
    this.showConfirm.set(false);
  }

  protected onBackdropMouseDown(event: MouseEvent): void {
    this.pressedOnBackdrop = event.target === event.currentTarget;
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.pressedOnBackdrop && event.target === event.currentTarget) {
      this.auth.close();
    }
    this.pressedOnBackdrop = false;
  }

  // Copies the value to the clipboard even while it is masked.
  protected async copy(value: string): Promise<void> {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore.
    }
  }

  protected switchTab(tab: AuthTab): void {
    this.error.set(null);
    this.auth.tab.set(tab);
  }

  protected async submit(): Promise<void> {
    this.error.set(null);
    this.submitting.set(true);
    try {
      if (this.auth.tab() === 'login') {
        await this.auth.login({
          login: this.loginId,
          password: this.password,
        });
      } else {
        if (this.password !== this.confirm) {
          this.error.set('Паролі не співпадають');
          return;
        }
        await this.auth.register({
          userName: this.userName,
          email: this.email,
          password: this.password,
        });
      }
    } catch (err) {
      this.error.set(this.extractError(err));
    } finally {
      this.submitting.set(false);
    }
  }

  private extractError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const message: unknown = err.error?.message;
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
      if (err.status === 0) return 'Сервер недоступний';
    }
    return 'Щось пішло не так. Спробуйте ще раз.';
  }
}
