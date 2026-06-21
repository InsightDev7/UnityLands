import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../../components/icon/icon';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, IconComponent],
  template: `
    @if (auth.currentUser(); as user) {
      <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
        <section
          class="bg-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
        >
          <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <span
              class="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-3xl font-bold text-white shadow-brand-glow"
            >
              {{ initials() }}
            </span>

            <div class="min-w-0 flex-1 text-center sm:text-left">
              <div
                class="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
              >
                <h1 class="text-2xl font-bold text-white">{{ user.userName }}</h1>
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  [class]="roleClass(user.role)"
                  >{{ user.role }}</span
                >
                <span
                  class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-200"
                  >{{ i18n.t('profile.level') }} {{ level }}</span
                >
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300"
                  ><app-icon name="payments" class="text-amber-300 text-xs" /> {{ coins.toLocaleString() }}</span
                >
              </div>
              <p class="mt-1 text-gray-400">{{ user.email }}</p>

              <div class="mt-4">
                <div class="flex justify-between text-xs text-gray-400">
                  <span>{{ xp }} / {{ xpMax }} XP</span>
                  <span>{{ i18n.t('profile.level') }} {{ level + 1 }}</span>
                </div>
                <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    class="h-full rounded-full bg-brand-gradient"
                    [style.width.%]="xpPercent()"
                  ></div>
                </div>
              </div>
            </div>

            <button class="btn btn-ghost btn-sm shrink-0">{{ i18n.t('profile.edit') }}</button>
          </div>
        </section>

        <section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of stats; track stat.labelKey) {
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
            >
              <div class="flex items-center gap-2 text-sm text-gray-400">
                <app-icon [name]="stat.icon" class="text-base" /> {{ i18n.t(stat.labelKey) }}
              </div>
              <p class="mt-2 text-2xl font-bold text-brand-gradient">
                {{ stat.value }}
              </p>
            </div>
          }
        </section>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <div class="space-y-6 lg:col-span-2">
            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div class="mb-4 flex items-center justify-between">
                <h2 class="font-semibold text-white">{{ i18n.t('profile.badges') }}</h2>
                <span class="text-xs text-gray-400">
                  {{ earnedBadges() }} / {{ badges.length }}
                </span>
              </div>
              <div class="grid grid-cols-3 gap-3 sm:grid-cols-5">
                @for (badge of badges; track badge.nameKey) {
                  <div
                    class="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200"
                    [class]="
                      badge.earned
                        ? 'border-accent/40 bg-white/5'
                        : 'border-white/10 bg-surface-2 opacity-40'
                    "
                    [title]="i18n.t(badge.nameKey)"
                  >
                    <app-icon [name]="badge.icon" class="text-2xl" />
                    <span class="truncate text-[11px] text-gray-300">{{
                      i18n.t(badge.nameKey)
                    }}</span>
                  </div>
                }
              </div>
            </section>

            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">{{ i18n.t('profile.achievements') }}</h2>
              <ul class="space-y-4">
                @for (a of achievements; track a.titleKey) {
                  <li class="flex items-center gap-4">
                    <span
                      class="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                      [class]="
                        a.progress >= 100
                          ? 'bg-brand-gradient'
                          : 'bg-surface-2'
                      "
                       ><app-icon [name]="a.icon" class="text-xl" /></span
                    >
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-white">{{ i18n.t(a.titleKey) }}</p>
                        @if (a.progress >= 100) {
                          <span class="text-xs font-semibold text-accent">{{ i18n.t('profile.done') }}</span>
                        } @else {
                          <span class="text-xs text-gray-400">{{ a.progress }}%</span>
                        }
                      </div>
                      <p class="text-xs text-gray-400">{{ i18n.t(a.descKey) }}</p>
                      <div
                        class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
                      >
                        <div
                          class="h-full rounded-full bg-brand-gradient"
                          [style.width.%]="a.progress"
                        ></div>
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </section>

            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">{{ i18n.t('profile.account') }}</h2>
              <dl class="divide-y divide-white/5 text-sm">
                <div class="flex items-center justify-between py-3">
                  <dt class="text-gray-400">{{ i18n.t('profile.email') }}</dt>
                  <dd class="text-white">{{ user.email }}</dd>
                </div>
                <div class="flex items-center justify-between py-3">
                  <dt class="text-gray-400">{{ i18n.t('profile.role') }}</dt>
                  <dd class="text-white">{{ user.role }}</dd>
                </div>
                <div class="flex items-center justify-between py-3">
                  <dt class="text-gray-400">{{ i18n.t('profile.status') }}</dt>
                  <dd [class]="user.isBanned ? 'text-red-400' : 'text-accent'">
                    {{ user.isBanned ? i18n.t('profile.banned') : i18n.t('profile.active') }}
                  </dd>
                </div>
                <div class="flex items-center justify-between py-3">
                  <dt class="text-gray-400">{{ i18n.t('profile.memberSince') }}</dt>
                  <dd class="text-white">
                    {{ user.createdAt | date: 'mediumDate' }}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div class="space-y-6">
            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-3 font-semibold text-white">{{ i18n.t('profile.wallet') }}</h2>
              <div
                class="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-center"
              >
                <p class="inline-flex items-center gap-2 text-3xl font-bold text-amber-300">
                  <app-icon name="payments" class="text-3xl" /> {{ coins.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-gray-400">{{ i18n.t('profile.coins') }}</p>
              </div>
              <button class="btn btn-primary btn-sm mt-3 w-full">{{ i18n.t('profile.openStore') }}</button>
            </section>

            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">{{ i18n.t('profile.clan') }}</h2>
              <div class="flex items-center gap-3">
                <span
                  class="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white"
                  style="background:linear-gradient(135deg,#3b82f6,#6366f1)"
                  >NVA</span
                >
                <div>
                  <p class="text-sm font-medium text-white">{{ clan.name }}</p>
                  <p class="text-xs text-gray-400">{{ clan.role }}</p>
                </div>
              </div>
            </section>

            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">{{ i18n.t('profile.connections') }}</h2>
              <ul class="space-y-2">
                @for (c of connections; track c.label) {
                  <li
                    class="flex items-center justify-between rounded-xl border border-white/10 bg-surface-2 px-3 py-2"
                  >
                    <span class="flex items-center gap-2 text-sm text-gray-200">
                      <app-icon [name]="c.icon" class="text-base" /> {{ c.label }}
                    </span>
                    @if (c.linked) {
                      <span class="text-xs text-accent">{{ i18n.t('profile.linked') }}</span>
                    } @else {
                      <button class="text-xs font-semibold text-accent">{{ i18n.t('profile.connect') }}</button>
                    }
                  </li>
                }
              </ul>
            </section>
          </div>
        </div>
      </main>
    }
  `,
})
export class Profile {
  protected readonly auth = inject(AuthService);
  protected readonly i18n = inject(I18nService);

  protected readonly initials = computed(() =>
    (this.auth.currentUser()?.userName ?? '?').slice(0, 2).toUpperCase(),
  );

  protected readonly level = 7;
  protected readonly xp = 3250;
  protected readonly xpMax = 5000;
  protected readonly xpPercent = () => Math.round((this.xp / this.xpMax) * 100);
  protected readonly coins = 1250;

  protected readonly clan = { name: 'Nova Empire', role: 'Учасник' };

  protected readonly stats = [
    { labelKey: 'profile.stats.playtime', value: '210h', icon: 'timer' },
    { labelKey: 'profile.stats.kd', value: '410 / 95', icon: 'swords' },
    { labelKey: 'profile.stats.blocks', value: '128k', icon: 'grid_view' },
    { labelKey: 'profile.stats.achievements', value: '34', icon: 'emoji_events' },
  ];

  protected readonly badges = [
    { nameKey: 'profile.badge.first', icon: 'eco', earned: true },
    { nameKey: 'profile.badge.builder', icon: 'construction', earned: true },
    { nameKey: 'profile.badge.warrior', icon: 'shield', earned: true },
    { nameKey: 'profile.badge.explorer', icon: 'explore', earned: true },
    { nameKey: 'profile.badge.trader', icon: 'payments', earned: false },
    { nameKey: 'profile.badge.veteran', icon: 'military_tech', earned: false },
    { nameKey: 'profile.badge.champion', icon: 'star', earned: false },
    { nameKey: 'profile.badge.legend', icon: 'auto_awesome', earned: false },
    { nameKey: 'profile.badge.founder', icon: 'stars', earned: true },
    { nameKey: 'profile.badge.event', icon: 'celebration', earned: false },
  ];

  protected readonly achievements = [
    {
      titleKey: 'profile.achieve.lvl10',
      descKey: 'profile.achieve.lvl10Desc',
      icon: 'show_chart',
      progress: 70,
    },
    {
      titleKey: 'profile.achieve.builder',
      descKey: 'profile.achieve.builderDesc',
      icon: 'grid_view',
      progress: 100,
    },
    {
      titleKey: 'profile.achieve.clan',
      descKey: 'profile.achieve.clanDesc',
      icon: 'shield',
      progress: 100,
    },
    {
      titleKey: 'profile.achieve.pvp',
      descKey: 'profile.achieve.pvpDesc',
      icon: 'swords',
      progress: 40,
    },
  ];

  protected readonly connections = [
    { label: 'Discord', icon: 'chat', linked: true },
    { label: 'Steam', icon: 'sports_esports', linked: false },
    { label: 'Twitch', icon: 'live_tv', linked: false },
  ];

  protected readonly earnedBadges = () =>
    this.badges.filter((b) => b.earned).length;

  protected roleClass(role: string): string {
    return (
      {
        owner: 'bg-amber-500/15 text-amber-300',
        admin: 'bg-red-500/15 text-red-400',
        support: 'bg-purple-500/15 text-purple-300',
        user: 'bg-white/10 text-gray-300',
      }[role] ?? 'bg-white/10 text-gray-300'
    );
  }
}
