import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-admin-bans',
  template: `
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">{{ i18n.t('admin.bans.title') }}</h2>
      <span class="text-sm text-gray-400">{{ activeCount() }} {{ i18n.t('admin.bans.active') }}</span>
    </div>

    <div
      class="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-gray-500">
          <tr class="border-b border-white/5">
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.bans.player') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.bans.reason') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.bans.by') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.bans.expires') }}</th>
            <th class="px-5 py-3 font-medium text-right">{{ i18n.t('admin.bans.action') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          @for (ban of bans(); track ban.id) {
            <tr
              class="transition-all duration-200 hover:bg-white/5"
              [class.opacity-50]="!ban.active"
            >
              <td class="px-5 py-3">
                <p class="font-medium text-white">{{ ban.nick }}</p>
                <p class="text-xs text-gray-500">{{ ban.discord }}</p>
              </td>
              <td class="px-5 py-3 text-gray-300">{{ ban.reason }}</td>
              <td class="px-5 py-3 text-gray-400">{{ ban.by }}</td>
              <td class="px-5 py-3 text-gray-400">{{ ban.expires }}</td>
              <td class="px-5 py-3 text-right">
                @if (ban.active) {
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm"
                    (click)="unban(ban.id)"
                  >
                    {{ i18n.t('admin.bans.unban') }}
                  </button>
                } @else {
                  <span class="text-xs text-gray-500">{{ i18n.t('admin.bans.revoked') }}</span>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminBans {
  protected readonly i18n = inject(I18nService);

  protected readonly bans = signal([
    { id: 1, nick: 'Griefer_99', discord: 'griefer#9999', reason: 'Гриферство на спавні', by: 'Steve', date: '2026-06-15', expires: 'Назавжди', active: true },
    { id: 2, nick: 'xX_Hacker_Xx', discord: 'hacker.xx', reason: 'X-ray / чіти', by: 'Herobrine', date: '2026-06-12', expires: 'Назавжди', active: true },
    { id: 3, nick: 'SpamBot', discord: 'spam#0000', reason: 'Спам / реклама в чаті', by: 'Alex', date: '2026-06-10', expires: '2026-07-10', active: true },
    { id: 4, nick: 'RudeGuy', discord: 'rude.guy', reason: 'Образи', by: 'Alex', date: '2026-06-01', expires: '2026-06-08', active: false },
  ]);

  protected readonly activeCount = () =>
    this.bans().filter((b) => b.active).length;

  protected unban(id: number): void {
    this.bans.update((bans) =>
      bans.map((b) => (b.id === id ? { ...b, active: false } : b)),
    );
  }
}
