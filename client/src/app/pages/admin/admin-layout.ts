import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <div class="flex items-center gap-3">
        <span
          class="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-lg text-surface"
        >
          AD
        </span>
        <div>
          <h1 class="text-2xl font-bold sm:text-3xl">{{ i18n.t('admin.layout.title') }}</h1>
          <p class="text-sm text-gray-400">{{ i18n.t('admin.layout.subtitle') }}</p>
        </div>
      </div>

      <nav class="mt-8 flex flex-wrap gap-2 border-b border-white/5 pb-4">
        @for (tab of tabs; track tab.path) {
          <a
            [routerLink]="tab.path"
            routerLinkActive="tab-active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="tab"
          >
            <span>{{ tab.icon }}</span> {{ i18n.t(tab.labelKey) }}
          </a>
        }
      </nav>

      <div class="mt-8">
        <router-outlet />
      </div>
    </main>
  `,
})
export class AdminLayout {
  protected readonly i18n = inject(I18nService);

  protected readonly tabs = [
    { icon: 'DB', labelKey: 'admin.layout.dashboard', path: '/admin' },
    { icon: 'AP', labelKey: 'admin.layout.applications', path: '/admin/applications' },
    { icon: 'PL', labelKey: 'admin.layout.players', path: '/admin/players' },
    { icon: 'BN', labelKey: 'admin.layout.bans', path: '/admin/bans' },
  ];
}
