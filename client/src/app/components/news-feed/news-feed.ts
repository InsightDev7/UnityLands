import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-news-feed',
  template: `
    <section id="news" class="space-y-6">
      <div class="flex items-end justify-between">
        <h2 class="text-2xl font-bold">{{ i18n.t('news.title') }}</h2>
        <a
          href="#news"
          class="text-sm font-semibold text-accent transition-all duration-200 hover:text-accent-soft"
          >{{ i18n.t('news.viewAll') }}</a
        >
      </div>

      @for (item of news; track item.id) {
        <article
          class="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:bg-white/10 sm:flex-row"
        >
          <div
            class="bg-glow flex items-center justify-center bg-surface-2 text-5xl sm:w-44 sm:shrink-0"
          >
            <span class="py-10 sm:py-0">{{ item.emoji }}</span>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-center gap-3 text-xs">
              <span
                class="rounded-full bg-accent/15 px-3 py-1 font-medium text-accent"
                >{{ i18n.t('news.' + item.id + '.tag') }}</span
              >
              <span class="text-gray-500">{{ item.date }}</span>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-white">
              {{ i18n.t('news.' + item.id + '.title') }}
            </h3>
            <p class="mt-2 flex-1 text-sm text-gray-400">{{ i18n.t('news.' + item.id + '.excerpt') }}</p>
            <a
              href="#news"
              class="mt-4 text-sm font-semibold text-accent transition-all duration-200 hover:text-accent-soft"
              >{{ i18n.t('news.readMore') }}</a
            >
          </div>
        </article>
      }
    </section>
  `,
})
export class NewsFeed {
  protected readonly i18n = inject(I18nService);

  protected readonly news = [
    { id: '1', date: '10 червня 2026', emoji: '🚀' },
    { id: '2', date: '4 червня 2026', emoji: '🏗️' },
    { id: '3', date: '28 травня 2026', emoji: '🎉' },
  ];
}
