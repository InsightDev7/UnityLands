import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-admin-players',
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-white">{{ i18n.t('admin.players.title') }}</h2>
      <input
        type="text"
        [placeholder]="i18n.t('admin.players.search')"
        class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 transition-all duration-200 focus:border-accent/50 focus:outline-none sm:w-64"
      />
    </div>

    <div
      class="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-gray-500">
          <tr class="border-b border-white/5">
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.player') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.discord') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.role') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.playtime') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.kd') }}</th>
            <th class="px-5 py-3 font-medium">{{ i18n.t('admin.players.clan') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          @for (p of players; track p.nick) {
            <tr class="transition-all duration-200 hover:bg-white/5">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <span class="relative">
                    <span
                      class="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-xs font-bold text-white"
                    >
                      {{ p.nick.slice(0, 2).toUpperCase() }}
                    </span>
                    <span
                      class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface"
                      [class]="p.online ? 'bg-accent' : 'bg-gray-600'"
                    ></span>
                  </span>
                  <span class="font-medium text-white">{{ p.nick }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-gray-400">{{ p.discord }}</td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-medium"
                  [class]="roleClass(p.role)"
                >
                  {{ p.role }}
                </span>
              </td>
              <td class="px-5 py-3 text-gray-300">{{ p.playtime }}</td>
              <td class="px-5 py-3 text-gray-300">
                {{ p.kills }} / {{ p.deaths }}
              </td>
              <td class="px-5 py-3 text-gray-400">{{ p.clan }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminPlayers {
  protected readonly i18n = inject(I18nService);

  protected readonly players = [
    { nick: 'Steve', discord: 'steve#0001', role: 'Admin', playtime: '480h', kills: 1203, deaths: 88, clan: 'Nova Empire', online: true },
    { nick: 'Alex', discord: 'alex.mc', role: 'Moderator', playtime: '312h', kills: 642, deaths: 120, clan: 'Aqua Guild', online: true },
    { nick: 'Herobrine', discord: 'hero_brine#666', role: 'Moderator', playtime: '901h', kills: 2310, deaths: 14, clan: 'Shadow Pact', online: false },
    { nick: 'Dia_mond', discord: 'diamond.gg', role: 'VIP', playtime: '210h', kills: 410, deaths: 95, clan: 'Golden Order', online: true },
    { nick: 'CreeperKing', discord: 'creeper_k#7777', role: 'Player', playtime: '76h', kills: 188, deaths: 142, clan: 'Red Dragons', online: false },
    { nick: 'EnderGirl', discord: 'ender.girl', role: 'Player', playtime: '54h', kills: 97, deaths: 60, clan: '-', online: false },
    { nick: 'Notch', discord: 'notch#0001', role: 'Player', playtime: '12h', kills: 24, deaths: 31, clan: '-', online: true },
  ];

  protected roleClass(role: string): string {
    return (
      {
        Admin: 'bg-red-500/15 text-red-400',
        Moderator: 'bg-purple-500/15 text-purple-300',
        VIP: 'bg-amber-500/15 text-amber-300',
        Player: 'bg-white/10 text-gray-300',
      }[role] ?? 'bg-white/10 text-gray-300'
    );
  }
}
