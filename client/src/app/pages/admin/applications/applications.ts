import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

type Status = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-admin-applications',
  template: `
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">{{ i18n.t('admin.applications.title') }}</h2>
      <span class="text-sm text-gray-400">{{ pendingCount() }} {{ i18n.t('admin.applications.pending') }}</span>
    </div>

    <div class="mt-4 space-y-4">
      @for (app of applications(); track app.id) {
        <article
          class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <span
                class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-surface"
              >
                {{ app.nick.slice(0, 2).toUpperCase() }}
              </span>
              <div>
                <p class="font-semibold text-white">{{ app.nick }}</p>
                <p class="text-xs text-gray-400">
                  {{ app.discord }} · {{ app.age }} років · {{ app.submitted }}
                </p>
              </div>
            </div>

            @switch (app.status) {
              @case ('pending') {
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    (click)="setStatus(app.id, 'approved')"
                  >
                    {{ i18n.t('admin.applications.approve') }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    (click)="setStatus(app.id, 'rejected')"
                  >
                    {{ i18n.t('admin.applications.reject') }}
                  </button>
                </div>
              }
              @case ('approved') {
                <span
                  class="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent"
                >
                  {{ i18n.t('admin.applications.approved') }}
                </span>
              }
              @case ('rejected') {
                <span
                  class="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400"
                >
                  {{ i18n.t('admin.applications.rejected') }}
                </span>
              }
            }
          </div>

          <p class="mt-3 border-t border-white/5 pt-3 text-sm text-gray-300">
            "{{ app.message }}"
          </p>
        </article>
      }
    </div>
  `,
})
export class AdminApplications {
  protected readonly i18n = inject(I18nService);

  protected readonly applications = signal([
    {
      id: 1, nick: 'Notch', discord: 'notch#0001', age: 22,
      submitted: '2год тому', status: 'pending' as Status,
      message: 'Давній будівельник, цікавлюся середньовічною архітектурою. Шукаю спокійну survival-спільноту.',
    },
    {
      id: 2, nick: 'Dia_mond', discord: 'diamond.gg', age: 18,
      submitted: '5год тому', status: 'pending' as Status,
      message: 'Обожнюю редстоун-механізми і хочу побудувати публічну ферму!',
    },
    {
      id: 3, nick: 'CreeperKing', discord: 'creeper_k#7777', age: 25,
      submitted: '1д тому', status: 'pending' as Status,
      message: 'PvP-ентузіаст, чесний гравець, повністю прочитав правила. Готовий приєднатися до клану.',
    },
    {
      id: 4, nick: 'EnderGirl', discord: 'ender.girl', age: 20,
      submitted: '2д тому', status: 'pending' as Status,
      message: 'Дослідниця та картограф. Хотіла б допомагати документувати світ.',
    },
  ]);

  protected readonly pendingCount = () =>
    this.applications().filter((a) => a.status === 'pending').length;

  protected setStatus(id: number, status: Status): void {
    this.applications.update((apps) =>
      apps.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }
}
