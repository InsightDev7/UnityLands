import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-welcome-card',
  imports: [IconComponent],
  template: `
    <section class="space-y-8">
      <!-- Hero -->
      <div
        class="bg-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-10"
      >
        <span
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-md"
        >
          <span class="h-2 w-2 rounded-full bg-accent"></span>
          120+ {{ i18n.t('welcome.online') }}
        </span>

        <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {{ i18n.t('welcome.title') }} <span class="text-brand-gradient">UnityLands</span>
        </h1>

        <p class="mt-4 max-w-xl text-gray-400">
          {{ i18n.t('welcome.subtitle') }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#join" class="btn btn-primary">{{ i18n.t('welcome.join') }}</a>
          <a href="#about" class="btn btn-ghost">{{ i18n.t('welcome.learn') }}</a>
        </div>
      </div>

      <!-- Connection info -->
      <div
        class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <h2 class="mb-1 text-lg font-bold text-white">Підключення до Unity Lands</h2>
        <p class="mb-5 text-sm text-gray-400">
          Щоб потрапити на наш сервер, ви повинні бути додані у Whitelist.
          Якщо вашу анкету вже схвалили — використовуйте дані нижче:
        </p>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="dns" class="text-accent/80" />
            <div>
              <p class="text-xs text-gray-500">IP-адреса</p>
              <p class="text-sm font-medium text-white">mc.unitylands.cc</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="inventory_2" class="text-accent/80" />
            <div>
              <p class="text-xs text-gray-500">Версія</p>
              <p class="text-sm font-medium text-white">Java 1.21.11</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="check_circle" class="text-green-400" />
            <div>
              <p class="text-xs text-gray-500">Статус</p>
              <p class="text-sm font-medium text-white">Online 24/7</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="lock" class="text-amber-400" />
            <div>
              <p class="text-xs text-gray-500">Вхід</p>
              <p class="text-sm font-medium text-white">Ліцензія не потрібна, але діє Whitelist</p>
            </div>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p class="flex items-start gap-2 text-sm text-red-300">
            <app-icon name="warning" class="text-red-400 shrink-0 mt-0.5" />
            <span>Якщо ви не подавали заявку, при спробі входу ви отримаєте помилку.</span>
          </p>
        </div>

        <a
          href="https://discord.gg/Z6FtfgWBDa"
          target="_blank"
          class="btn btn-primary mt-4 inline-flex items-center gap-2"
        >
          <app-icon name="open_in_new" />
          Подати заявку на Whitelist
        </a>
      </div>

      <!-- About -->
      <div
        class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <h2 class="mb-1 text-lg font-bold text-white">Про наш сервер</h2>
        <p class="text-gray-300 leading-relaxed">
          UNITY LANDS — це приватний ванільний сервер для тих, хто втомився від
          хаосу, нескінченних плагінів та токсичності. Ми створюємо простір, де
          головна цінність — це гравець та його творчість.
        </p>

        <h3 class="mt-6 mb-4 text-base font-semibold text-white">Наші особливості</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="shield" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Whitelist</p>
              <p class="text-xs text-gray-400">Ретельно відбираємо кожного гравця через анкетування.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="payments" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Жива економіка</p>
              <p class="text-xs text-gray-400">Торгуй як у реальному житті, використовуючи алмази.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="history" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Світ без вайпів</p>
              <p class="text-xs text-gray-400">Будуй замки, знаючи, що вони залишаться в історії.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="record_voice_over" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Голосовий чат</p>
              <p class="text-xs text-gray-400">Спілкуйся з друзями прямо в грі (Simple Voice Chat).</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="favorite" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Культура поваги</p>
              <p class="text-xs text-gray-400">Гриферство та токсичність неможливі завдяки суворому відбору.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-white/10 bg-surface-2 px-4 py-3">
            <app-icon name="auto_stories" class="text-accent/80 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-white">Історія та Lore</p>
              <p class="text-xs text-gray-400">Кожен гравець стає частиною літопису сервера.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Social media -->
      <div
        class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <h2 class="mb-4 text-lg font-bold text-white">Наші соцмережі</h2>
        <div class="flex flex-wrap gap-3">
          <a href="https://www.tiktok.com/@unitylands.cc" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="smart_display" /> TikTok
          </a>
          <a href="https://www.tiktok.com/@unitylands.media" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="smart_display" /> TikTok Media
          </a>
          <a href="https://t.me/unitylands" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="send" /> Telegram
          </a>
          <a href="https://www.youtube.com/@UnityLands" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="play_circle" /> YouTube
          </a>
          <a href="https://www.instagram.com/unitylands.cc" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="photo_camera" /> Instagram
          </a>
          <a href="https://unitylands.cc/" target="_blank" class="btn btn-ghost btn-sm inline-flex items-center gap-2">
            <app-icon name="language" /> Сайт
          </a>
        </div>
        <p class="mt-4 text-xs text-gray-500">
          Слідкуйте за життям сервера, дивіться круті моменти та діліться своїми досягненнями.
        </p>
      </div>
    </section>
  `,
})
export class WelcomeCard {
  protected readonly i18n = inject(I18nService);
}
