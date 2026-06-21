import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main
      class="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center"
    >
      <img
        src="ico/main.png"
        alt=""
        class="float-emblem pulse-glow h-28 w-28 rounded-full"
      />

      <h1 class="status-code mt-8 text-7xl font-extrabold sm:text-8xl">404</h1>
      <h2 class="mt-2 text-2xl font-bold text-white">Сторінку не знайдено</h2>
      <p class="mt-3 max-w-md text-gray-400">
        Здається, ця сторінка загубилась десь у Краю. Перевірте адресу або
        поверніться на головну.
      </p>

      <a routerLink="/" class="btn btn-primary mt-8">На головну</a>
    </main>
  `,
})
export class NotFound {}
