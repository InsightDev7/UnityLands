import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-welcome-card',
  template: `
    <section
      class="bg-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10"
    >
      <span
        class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-md"
      >
        <span class="h-2 w-2 rounded-full bg-accent"></span>
        120+ {{ i18n.t('welcome.online') }}
      </span>

      <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {{ i18n.t('welcome.title') }} <span class="text-brand-gradient">UnityLands</span>
      </h1>

      <p class="mt-4 max-w-xl text-gray-400">
        {{ i18n.t('welcome.subtitle') }}
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href="#join" class="btn btn-primary">{{ i18n.t('welcome.join') }}</a>
        <a href="#about" class="btn btn-ghost">{{ i18n.t('welcome.learn') }}</a>
      </div>
    </section>
  `,
})
export class WelcomeCard {
  protected readonly i18n = inject(I18nService);
}
