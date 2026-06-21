import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-surface/70 backdrop-blur-xl"
    >
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a routerLink="/" class="flex items-center gap-2.5 text-lg font-bold">
          <img
            src="ico/main.png"
            alt="UnityLands logo"
            class="h-9 w-9 rounded-full shadow-brand-glow"
          />
          <span class="text-brand-gradient">UnityLands</span>
        </a>

        <ul class="nav-group hidden md:flex">
          @for (link of links; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive="nav-link-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
              >
                <span class="nav-ico">{{ link.icon }}</span>
                {{ i18n.t(link.key) }}
              </a>
            </li>
          }
        </ul>

        @if (auth.loggedIn()) {
          <div class="relative" #dropdown>
            <button
              type="button"
              (click)="toggle($event)"
              class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1 pl-1.5 pr-2 transition-all duration-200 hover:bg-white/10"
              [attr.aria-expanded]="open()"
              aria-haspopup="menu"
            >
              <span
                class="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-xs font-bold text-white"
              >
                {{ initials() }}
              </span>
              <span class="text-sm font-medium text-white">
                {{ auth.currentUser()?.userName }}
              </span>
              <svg
                class="h-4 w-4 text-gray-400 transition-all duration-200"
                [class.rotate-180]="open()"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            @if (open()) {
              <div
                class="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-surface-2/95 p-2 shadow-xl backdrop-blur-xl"
                role="menu"
              >
                <div class="border-b border-white/5 px-3 pb-3 pt-2">
                  <div class="flex items-center gap-3">
                    <span
                      class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-white"
                    >
                      {{ initials() }}
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-semibold text-white">
                        {{ auth.currentUser()?.userName }}
                      </p>
                      <p class="truncate text-xs text-gray-400">
                        {{ auth.currentUser()?.email }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                      [class]="roleClass(auth.currentUser()?.role)"
                      >{{ auth.currentUser()?.role }}</span
                    >
                    <span
                      class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-200"
                      >Lvl {{ level }}</span
                    >
                    <span
                      class="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300"
                      >🪙 {{ coins.toLocaleString() }}</span
                    >
                  </div>
                </div>

                <ul class="mt-1 space-y-0.5">
                  <li>
                    <a
                      routerLink="/profile"
                      routerLinkActive="menu-link-active"
                      [routerLinkActiveOptions]="{ exact: true }"
                      role="menuitem"
                      (click)="close()"
                      class="menu-link"
                    >
                      <span class="nav-ico">👤</span> {{ i18n.t('menu.profile') }}
                    </a>
                  </li>
                  <li>
                    <a
                      routerLink="/applications"
                      routerLinkActive="menu-link-active"
                      role="menuitem"
                      (click)="close()"
                      class="menu-link"
                    >
                      <span class="nav-ico">📝</span>
                      {{ i18n.t('menu.applications') }}
                    </a>
                  </li>
                  @if (isAdmin()) {
                    <li>
                      <a
                        routerLink="/admin"
                        routerLinkActive="menu-link-active"
                        role="menuitem"
                        (click)="close()"
                        class="menu-link"
                      >
                        <span class="nav-ico">⚙️</span> {{ i18n.t('menu.admin') }}
                      </a>
                    </li>
                  }
                </ul>

                <div class="mt-1 border-t border-white/5 pt-1">
                  <button
                    type="button"
                    (click)="signOut()"
                    aria-label="Вийти"
                    title="Вийти"
                    class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <span>{{ i18n.t('menu.signout') }}</span>
                    <span
                      class="grid h-7 w-7 place-items-center rounded-full border border-red-400/40 text-red-400"
                    >
                      ⏻
                    </span>
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="auth.show('login')"
              class="btn btn-ghost btn-sm"
            >
              {{ i18n.t('auth.login') }}
            </button>
            <button
              type="button"
              (click)="auth.show('register')"
              class="btn btn-primary btn-sm"
            >
              {{ i18n.t('auth.register') }}
            </button>
          </div>
        }
      </nav>
    </header>
  `,
})
export class Navbar {
  protected readonly auth = inject(AuthService);
  protected readonly i18n = inject(I18nService);
  protected readonly open = signal(false);
  private readonly dropdown = viewChild<ElementRef<HTMLElement>>('dropdown');

  protected readonly links = [
    { key: 'nav.home', path: '/', icon: '🏠' },
    { key: 'nav.rules', path: '/rules', icon: '📜' },
    { key: 'nav.clans', path: '/clans', icon: '🛡️' },
    { key: 'nav.map', path: '/map', icon: '🗺️' },
    { key: 'nav.applications', path: '/applications', icon: '📝' },
  ];

  // First two letters of the username, for the avatar placeholder.
  protected readonly initials = computed(() =>
    (this.auth.currentUser()?.userName ?? '?').slice(0, 2).toUpperCase(),
  );

  // Theoretical progression data until the backend exposes it.
  protected readonly level = 7;
  protected readonly coins = 1250;

  protected roleClass(role: string | undefined): string {
    return (
      {
        owner: 'bg-amber-500/15 text-amber-300',
        admin: 'bg-red-500/15 text-red-400',
        support: 'bg-purple-500/15 text-purple-300',
        user: 'bg-white/10 text-gray-300',
      }[role ?? 'user'] ?? 'bg-white/10 text-gray-300'
    );
  }

  // Admin panel is visible only to privileged roles.
  protected readonly isAdmin = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'admin' || role === 'owner';
  });

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }

  // Close the menu on any click outside the dropdown (toggle + menu).
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const el = this.dropdown()?.nativeElement;
    if (el && !el.contains(event.target as Node)) {
      this.close();
    }
  }

  protected signOut(): void {
    this.close();
    void this.auth.logout();
  }
}
