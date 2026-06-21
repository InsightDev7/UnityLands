import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="space-y-6">
      <div
        class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-white">{{ i18n.t('sidebar.status.title') }}</h3>
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-accent"></span> {{ i18n.t('sidebar.status.online') }}
          </span>
        </div>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <dt class="text-gray-400">Players online</dt>
            <dd class="font-medium text-white">124 / 200</dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-gray-400">Version</dt>
            <dd class="font-medium text-white">1.21.x</dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-gray-400">Uptime</dt>
            <dd class="font-medium text-white">99.9%</dd>
          </div>
        </dl>
        <div
          class="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-surface-2 px-3 py-2"
        >
          <code class="text-sm text-accent">play.unitylands.gg</code>
          <span class="text-xs text-gray-500">{{ i18n.t('sidebar.copy') }}</span>
        </div>
      </div>

      <div
        id="join"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <h3 class="font-semibold text-white">{{ i18n.t('sidebar.join.title') }}</h3>
        <ol class="mt-4 space-y-4">
          <li class="flex gap-3">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-sm font-bold text-accent">1</span>
            <div>
              <p class="text-sm font-medium text-white">{{ i18n.t('sidebar.join.step1.title') }}</p>
              <p class="text-xs text-gray-400">{{ i18n.t('sidebar.join.step1.desc') }}</p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-sm font-bold text-accent">2</span>
            <div>
              <p class="text-sm font-medium text-white">{{ i18n.t('sidebar.join.step2.title') }}</p>
              <p class="text-xs text-gray-400">{{ i18n.t('sidebar.join.step2.desc') }}</p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15 text-sm font-bold text-accent">3</span>
            <div>
              <p class="text-sm font-medium text-white">{{ i18n.t('sidebar.join.step3.title') }}</p>
              <p class="text-xs text-gray-400">{{ i18n.t('sidebar.join.step3.desc') }}</p>
            </div>
          </li>
        </ol>
      </div>

      <div
        id="about"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <h3 class="font-semibold text-white">{{ i18n.t('sidebar.why.title') }}</h3>
        <ul class="mt-4 space-y-3 text-sm text-gray-400">
          <li class="flex items-center gap-2"><span class="text-accent">✓</span> {{ i18n.t('sidebar.why.fair') }}</li>
          <li class="flex items-center gap-2"><span class="text-accent">✓</span> {{ i18n.t('sidebar.why.world') }}</li>
          <li class="flex items-center gap-2"><span class="text-accent">✓</span> {{ i18n.t('sidebar.why.community') }}</li>
          <li class="flex items-center gap-2"><span class="text-accent">✓</span> {{ i18n.t('sidebar.why.performance') }}</li>
          <li class="flex items-center gap-2"><span class="text-accent">✓</span> {{ i18n.t('sidebar.why.events') }}</li>
        </ul>
      </div>

      <div
        class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <h3 class="font-semibold text-white">{{ i18n.t('sidebar.community.title') }}</h3>
        <div class="mt-4 grid grid-cols-3 gap-2">
          @for (social of socials; track social.label) {
            <a
              href="#"
              [attr.aria-label]="social.label"
              class="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-surface-2 py-3 text-gray-300 transition-all duration-200 hover:border-accent/40 hover:text-accent"
            >
              <span class="text-xl">{{ social.icon }}</span>
              <span class="text-[11px]">{{ social.label }}</span>
            </a>
          }
        </div>
      </div>
    </aside>
  `,
})
export class Sidebar {
  protected readonly i18n = inject(I18nService);

  protected readonly socials = [
    { icon: '💬', label: 'Discord' },
    { icon: '▶', label: 'YouTube' },
    { icon: '𝕏', label: 'Twitter' },
  ];
}
