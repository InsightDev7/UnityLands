import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  template: `
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      @for (stat of stats; track stat.labelKey) {
        <div
          class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
        >
          <p class="text-sm text-gray-400">{{ i18n.t(stat.labelKey) }}</p>
          <p class="mt-2 text-2xl font-bold text-brand-gradient">
            {{ stat.value }}
          </p>
          <p class="mt-1 text-xs text-accent">{{ stat.change }}</p>
        </div>
      }
    </div>

    <h2 class="mt-10 text-lg font-semibold text-white">{{ i18n.t('admin.dashboard.management') }}</h2>
    <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (tool of tools; track tool.titleKey) {
        <a
          [routerLink]="tool.path"
          class="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/10"
        >
          <span
            class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl"
          >
            {{ tool.icon }}
          </span>
          <div>
            <h3 class="font-semibold text-white">{{ i18n.t(tool.titleKey) }}</h3>
            <p class="mt-1 text-sm text-gray-400">{{ i18n.t(tool.descKey) }}</p>
          </div>
        </a>
      }
    </div>

    <h2 class="mt-10 text-lg font-semibold text-white">{{ i18n.t('admin.dashboard.recent') }}</h2>
    <div
      class="mt-4 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      @for (log of activity; track $index) {
        <div class="flex items-center justify-between px-5 py-3 text-sm">
          <span class="text-gray-300">
            <span class="font-medium text-white">{{ log.user }}</span>
            {{ i18n.t(log.actionKey) }}
          </span>
          <span class="text-xs text-gray-500">{{ log.time }}</span>
        </div>
      }
    </div>
  `,
})
export class AdminDashboard {
  protected readonly i18n = inject(I18nService);

  protected readonly stats = [
    { labelKey: 'admin.dashboard.total', value: '1,024', change: '+12 сьогодні' },
    { labelKey: 'admin.dashboard.online', value: '124', change: '+8 проти середнього' },
    { labelKey: 'admin.dashboard.pending', value: '8', change: '3 нових' },
    { labelKey: 'admin.dashboard.bans', value: '14', change: '2 цього тижня' },
  ];

  protected readonly tools = [
    { icon: 'AP', titleKey: 'admin.dashboard.applications', descKey: 'admin.dashboard.applicationsDesc', path: '/admin/applications' },
    { icon: 'PL', titleKey: 'admin.dashboard.playersBtn', descKey: 'admin.dashboard.playersDesc', path: '/admin/players' },
    { icon: 'BN', titleKey: 'admin.dashboard.bansBtn', descKey: 'admin.dashboard.bansDesc', path: '/admin/bans' },
  ];

  protected readonly activity = [
    { user: 'Steve', actionKey: 'activity.ban', time: '2хв тому' },
    { user: 'Alex', actionKey: 'activity.approve', time: '18хв тому' },
    { user: 'System', actionKey: 'activity.backup', time: '1год тому' },
    { user: 'Herobrine', actionKey: 'activity.changerole', time: '3год тому' },
  ];
}
