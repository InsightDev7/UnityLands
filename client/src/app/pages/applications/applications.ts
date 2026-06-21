import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApplicationCreator } from './application-creator/application-creator';

type AppTab = 'apply' | 'review' | 'create' | 'history';
type AppStatus = 'pending' | 'approved' | 'rejected';

interface Position {
  id: number;
  title: string;
  desc: string;
  icon: string;
  open: boolean;
}

interface MyApplication {
  id: number;
  title: string;
  submitted: string;
  status: AppStatus;
}

interface Submission {
  id: number;
  applicant: string;
  position: string;
  submitted: string;
  status: AppStatus;
}

@Component({
  selector: 'app-applications',
  imports: [FormsModule, ApplicationCreator],
  template: `
    <main class="mx-auto max-w-5xl px-6 pb-16 pt-28">
      <h1 class="text-3xl font-bold sm:text-4xl">
        <span class="text-brand-gradient">Заявки</span>
      </h1>
      <p class="mt-3 text-gray-400">
        @if (isAdmin()) {
          Керуйте заявками гравців на ролі сервера.
        } @else {
          Подавайте заявки на ролі та відстежуйте їх розгляд.
        }
      </p>

      <!-- Role-based mini-header tabs (scrolls horizontally with Shift+wheel) -->
      <nav
        class="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-white/5 pb-4"
      >
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            class="tab shrink-0"
            [class.tab-active]="activeTab() === tab.id"
            (click)="activeTab.set(tab.id)"
          >
            <span>{{ tab.icon }}</span> {{ tab.label }}
          </button>
        }
      </nav>

      <div class="mt-8">
        @switch (activeTab()) {
          <!-- USER: respond to a position -->
          @case ('apply') {
            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">Відкриті позиції</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                @for (pos of positions(); track pos.id) {
                  <article
                    class="flex flex-col rounded-2xl border border-white/10 bg-surface-2 p-5"
                  >
                    <div class="flex items-center gap-3">
                      <span
                        class="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-lg text-white"
                        >{{ pos.icon }}</span
                      >
                      <h3 class="font-semibold text-white">{{ pos.title }}</h3>
                    </div>
                    <p class="mt-3 flex-1 text-sm text-gray-400">{{ pos.desc }}</p>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm mt-4"
                      [disabled]="!pos.open || hasApplied(pos.title)"
                      (click)="apply(pos)"
                    >
                      {{
                        !pos.open
                          ? 'Зачинено'
                          : hasApplied(pos.title)
                            ? 'Подано'
                            : 'Відгукнутися'
                      }}
                    </button>
                  </article>
                }
              </div>
            </section>

            <section
              class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">Мої заявки</h2>
              @if (myApps().length === 0) {
                <p class="text-sm text-gray-500">
                  Ви ще не подавали заявок. Оберіть позицію вище.
                </p>
              } @else {
                <ul class="space-y-3">
                  @for (app of myApps(); track app.id) {
                    <li
                      class="flex items-center justify-between rounded-xl border border-white/10 bg-surface-2 p-4"
                    >
                      <div>
                        <p class="text-sm font-medium text-white">{{ app.title }}</p>
                        <p class="text-xs text-gray-500">{{ app.submitted }}</p>
                      </div>
                      <span
                        class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        [class]="statusClass(app.status)"
                        >{{ statusLabel(app.status) }}</span
                      >
                    </li>
                  }
                </ul>
              }
            </section>
          }

          <!-- ADMIN: review pending submissions -->
          @case ('review') {
            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">Заявки на розгляді</h2>
              @if (pending().length === 0) {
                <p class="text-sm text-gray-500">Немає заявок на розгляді.</p>
              } @else {
                <ul class="space-y-3">
                  @for (sub of pending(); track sub.id) {
                    <li
                      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface-2 p-4"
                    >
                      <div class="flex items-center gap-3">
                        <span
                          class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-white"
                          >{{ sub.applicant.slice(0, 2).toUpperCase() }}</span
                        >
                        <div>
                          <p class="text-sm font-medium text-white">
                            {{ sub.applicant }}
                          </p>
                          <p class="text-xs text-gray-400">
                            {{ sub.position }} · {{ sub.submitted }}
                          </p>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          (click)="setStatus(sub.id, 'approved')"
                        >
                          Схвалити
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          (click)="setStatus(sub.id, 'rejected')"
                        >
                          Відхилити
                        </button>
                      </div>
                    </li>
                  }
                </ul>
              }
            </section>
          }

          <!-- ADMIN: create application (forum-style creator) -->
          @case ('create') {
            <app-application-creator />
          }

          <!-- ADMIN: processed history -->
          @case ('history') {
            <section
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h2 class="mb-4 font-semibold text-white">Історія заявок</h2>
              @if (history().length === 0) {
                <p class="text-sm text-gray-500">Історія порожня.</p>
              } @else {
                <ul class="divide-y divide-white/5">
                  @for (sub of history(); track sub.id) {
                    <li class="flex items-center justify-between py-3 text-sm">
                      <span class="text-gray-300">
                        <span class="font-medium text-white">{{
                          sub.applicant
                        }}</span>
                        · {{ sub.position }}
                      </span>
                      <span
                        class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        [class]="statusClass(sub.status)"
                        >{{ statusLabel(sub.status) }}</span
                      >
                    </li>
                  }
                </ul>
              }
            </section>
          }
        }
      </div>
    </main>
  `,
})
export class Applications {
  private readonly auth = inject(AuthService);

  private readonly roleLevel: Record<string, number> = {
    user: 1,
    support: 2,
    admin: 3,
    owner: 4,
  };

  protected readonly isAdmin = computed(() => this.level() >= 3);

  private readonly level = computed(
    () => this.roleLevel[this.auth.currentUser()?.role ?? 'user'] ?? 1,
  );

  // Single ordered list, left → right by required privilege.
  // Lower `minLevel` = available to everyone; raise/lower a value to re-gate a
  // section to a different role later.
  private readonly allTabs: {
    id: AppTab;
    label: string;
    icon: string;
    minLevel: number;
  }[] = [
    { id: 'apply', label: 'Відгукнутися', icon: '📝', minLevel: 1 },
    { id: 'review', label: 'Переглянути заявки', icon: '📋', minLevel: 3 },
    { id: 'create', label: 'Створити заявку', icon: '➕', minLevel: 3 },
    { id: 'history', label: 'Історія заявок', icon: '🕓', minLevel: 3 },
  ];

  protected readonly tabs = computed(() =>
    this.allTabs.filter((t) => this.level() >= t.minLevel),
  );

  protected readonly activeTab = signal<AppTab>('apply');

  constructor() {
    // Keep the active tab valid for the current role (default to the first one).
    effect(() => {
      const ids = this.tabs().map((t) => t.id);
      if (!ids.includes(this.activeTab())) {
        this.activeTab.set(ids[0]);
      }
    });
  }

  // ── Theoretical data (front-end only until the backend lands) ──
  protected readonly positions = signal<Position[]>([
    { id: 1, title: 'Підтримка', desc: 'Допомагай гравцям у чаті та обробляй тікети.', icon: '🎧', open: true },
    { id: 2, title: 'Будівельник', desc: 'Будуй спавн та мапи для івентів.', icon: '🏗️', open: true },
    { id: 3, title: 'Модератор', desc: 'Підтримуй порядок і чесну гру.', icon: '🛡️', open: false },
  ]);

  protected readonly myApps = signal<MyApplication[]>([]);

  protected readonly submissions = signal<Submission[]>([
    { id: 1, applicant: 'Notch', position: 'Підтримка', submitted: '2 год тому', status: 'pending' },
    { id: 2, applicant: 'Dia_mond', position: 'Будівельник', submitted: '5 год тому', status: 'pending' },
    { id: 3, applicant: 'EnderGirl', position: 'Підтримка', submitted: '1 день тому', status: 'approved' },
    { id: 4, applicant: 'Griefer_99', position: 'Модератор', submitted: '2 дні тому', status: 'rejected' },
  ]);

  protected readonly pending = computed(() =>
    this.submissions().filter((s) => s.status === 'pending'),
  );
  protected readonly history = computed(() =>
    this.submissions().filter((s) => s.status !== 'pending'),
  );

  private nextAppId = 1;

  protected hasApplied(title: string): boolean {
    return this.myApps().some((a) => a.title === title);
  }

  protected apply(pos: Position): void {
    if (this.hasApplied(pos.title)) return;
    this.myApps.update((apps) => [
      { id: this.nextAppId++, title: pos.title, submitted: 'щойно', status: 'pending' },
      ...apps,
    ]);
  }

  protected setStatus(id: number, status: AppStatus): void {
    this.submissions.update((subs) =>
      subs.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  }

  protected statusLabel(status: AppStatus): string {
    return { pending: 'На розгляді', approved: 'Схвалено', rejected: 'Відхилено' }[
      status
    ];
  }

  protected statusClass(status: AppStatus): string {
    return {
      pending: 'bg-amber-500/15 text-amber-300',
      approved: 'bg-accent/15 text-accent',
      rejected: 'bg-red-500/15 text-red-400',
    }[status];
  }
}
