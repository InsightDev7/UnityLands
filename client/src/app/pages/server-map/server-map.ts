import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../../components/icon/icon';

@Component({
  selector: 'app-server-map',
  imports: [IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <h1 class="text-3xl font-bold sm:text-4xl">
        <span class="text-brand-gradient">{{ i18n.t('map.title') }}</span>
      </h1>
      <p class="mt-3 text-gray-400">
        {{ i18n.t('map.subtitle') }}
      </p>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (stat of stats; track stat.labelKey) {
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <p class="text-sm text-gray-400">{{ i18n.t(stat.labelKey) }}</p>
            <p class="mt-2 text-2xl font-bold text-brand-gradient">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-xs text-accent">{{ i18n.t(stat.hintKey) }}</p>
          </div>
        }
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-3">
        <div
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-2"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold text-white">{{ i18n.t('map.worldmap') }}</h2>
            <span
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400"
              >{{ i18n.t('map.pending') }}</span
            >
          </div>

          <div
            class="bg-glow relative grid aspect-[3/2] place-items-center overflow-hidden rounded-xl border border-white/10"
            style="background-color:var(--color-surface-2);background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:40px 40px"
          >
            <div class="text-center">
              <div
                class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-3xl text-surface shadow-brand-glow"
              >
                <app-icon name="map" class="text-3xl" />
              </div>
              <p class="mt-4 font-semibold text-white">
                {{ i18n.t('map.placeholder') }}
              </p>
              <p class="mx-auto mt-1 max-w-xs text-sm text-gray-400">
                {{ i18n.t('map.placeholderDesc') }}
              </p>
              <button type="button" class="btn btn-ghost mt-5" disabled>
                {{ i18n.t('map.connecting') }}
              </button>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h2 class="mb-4 font-semibold text-white">{{ i18n.t('map.legend') }}</h2>
          <ul class="space-y-3">
            @for (item of legend; track item.labelKey) {
              <li class="flex items-center gap-3 text-sm">
                <span
                  class="h-4 w-4 shrink-0 rounded"
                  [style.background]="item.color"
                ></span>
                <div>
                  <p class="font-medium text-white">{{ i18n.t(item.labelKey) }}</p>
                  <p class="text-xs text-gray-400">{{ i18n.t(item.descKey) }}</p>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </main>
  `,
})
export class ServerMap {
  protected readonly i18n = inject(I18nService);

  protected readonly stats = [
    { labelKey: 'map.stat.border', value: '24,000²', hintKey: 'map.stat.borderHint' },
    { labelKey: 'map.stat.chunks', value: '8,412', hintKey: 'map.stat.chunksHint' },
    { labelKey: 'map.stat.online', value: '124', hintKey: 'map.stat.onlineHint' },
    { labelKey: 'map.stat.clans', value: '37', hintKey: 'map.stat.clansHint' },
  ];

  protected readonly legend = [
    { labelKey: 'map.legend.clan', descKey: 'map.legend.clanDesc', color: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
    { labelKey: 'map.legend.contested', descKey: 'map.legend.contestedDesc', color: 'linear-gradient(135deg,#ff5f6d,#ffc371)' },
    { labelKey: 'map.legend.spawn', descKey: 'map.legend.spawnDesc', color: '#3fb96f' },
    { labelKey: 'map.legend.wilderness', descKey: 'map.legend.wildernessDesc', color: 'rgba(255,255,255,0.15)' },
  ];
}
