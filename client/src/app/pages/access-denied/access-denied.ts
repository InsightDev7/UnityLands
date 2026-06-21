import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-access-denied',
  imports: [RouterLink],
  template: `
    <main
      class="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center"
    >
      <img
        src="ico/main.png"
        alt=""
        class="float-emblem pulse-glow-danger h-28 w-28 rounded-full"
      />

      <h1 class="status-code mt-8 text-6xl font-extrabold sm:text-7xl">
        Потрібен доступ
      </h1>
      <h2 class="mt-3 text-xl font-semibold text-white">
        Будь ласка, авторизуйтесь
      </h2>
      <p class="mt-3 max-w-md text-gray-400">
        Ця сторінка доступна лише для учасників UnityLands. Увійдіть у свій
        акаунт, щоб продовжити.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" (click)="auth.show('login')" class="btn btn-primary">
          Авторизуватись
        </button>
        <a routerLink="/" class="btn btn-ghost">На головну</a>
      </div>
    </main>
  `,
})
export class AccessDenied {
  protected readonly auth = inject(AuthService);
}
