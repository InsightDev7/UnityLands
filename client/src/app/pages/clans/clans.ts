import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../../components/icon/icon';

@Component({
  selector: 'app-clans',
  imports: [IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 class="text-3xl font-bold sm:text-4xl">
            <span class="text-brand-gradient">{{ i18n.t('clans.title') }}</span>
          </h1>
          <p class="mt-3 text-gray-400">
            {{ i18n.t('clans.subtitle') }}
          </p>
        </div>
        <button type="button" class="btn btn-primary">{{ i18n.t('clans.create') }}</button>
      </div>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (clan of clans; track clan.tag) {
          <article
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/10"
          >
            <div class="flex items-center gap-3">
              <span
                class="grid h-12 w-12 place-items-center rounded-xl text-lg font-bold text-surface"
                [style.background]="clan.color"
                >{{ clan.tag }}</span
              >
              <div>
                <h3 class="font-semibold text-white">{{ i18n.t(clan.nameKey) }}</h3>
                <p class="text-xs text-gray-400">{{ i18n.t('clans.level') }} {{ clan.level }}</p>
              </div>
            </div>
            <p class="mt-4 text-sm text-gray-400">{{ clan.descKey ? i18n.t(clan.descKey) : clan.description }}</p>
            <div
              class="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-sm"
            >
              <span class="inline-flex items-center gap-1 text-gray-400"><app-icon name="group" class="text-sm" /> {{ clan.members }} {{ i18n.t('clans.members') }}</span>
              <a
                href="#"
                class="font-semibold text-accent transition-all duration-200 hover:text-accent-soft"
                >{{ i18n.t('clans.view') }}</a
              >
            </div>
          </article>
        }
      </div>
    </main>
  `,
})
export class Clans {
  protected readonly i18n = inject(I18nService);

  protected readonly clans = [
    { tag: 'NVA', nameKey: 'clans.1.name', descKey: 'clans.1.desc', color: 'linear-gradient(135deg,#3b82f6,#6366f1)', members: 42, level: 12, description: '', name: '' },
    { tag: 'RDG', nameKey: 'clans.2.name', descKey: 'clans.2.desc', color: 'linear-gradient(135deg,#ff5f6d,#ffc371)', members: 28, level: 9, description: '', name: '' },
    { tag: 'AQA', nameKey: 'clans.3.name', descKey: 'clans.3.desc', color: 'linear-gradient(135deg,#2f86ff,#5ed9d4)', members: 35, level: 10, description: '', name: '' },
    { tag: 'SHD', nameKey: 'clans.4.name', descKey: 'clans.4.desc', color: 'linear-gradient(135deg,#8e2de2,#4a00e0)', members: 19, level: 7, description: '', name: '' },
    { tag: 'GLD', nameKey: 'clans.5.name', descKey: 'clans.5.desc', color: 'linear-gradient(135deg,#f7971e,#ffd200)', members: 24, level: 8, description: '', name: '' },
    { tag: 'FRO', nameKey: 'clans.6.name', descKey: 'clans.6.desc', color: 'linear-gradient(135deg,#83a4d4,#b6fbff)', members: 16, level: 6, description: '', name: '' },
  ];
}
