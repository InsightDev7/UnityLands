import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="border-t border-white/5 px-6 py-14">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col gap-10 md:flex-row md:justify-between">
          <div class="max-w-xs">
            <a routerLink="/" class="flex items-center gap-2.5 text-lg font-bold">
              <img
                src="ico/main.png"
                alt="UnityLands logo"
                class="h-8 w-8 rounded-full"
              />
              <span class="text-brand-gradient">UnityLands</span>
            </a>
            <p class="mt-4 text-sm text-gray-400">
              {{ i18n.t('footer.description') }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 class="text-sm font-semibold text-white">{{ i18n.t('footer.group.server') }}</h4>
              <ul class="mt-4 space-y-3 text-sm text-gray-400">
                <li><a href="#" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.server.about') }}</a></li>
                <li><a href="#join" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.server.join') }}</a></li>
                <li><a href="#news" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.server.news') }}</a></li>
                <li><a routerLink="/rules" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.server.rules') }}</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white">{{ i18n.t('footer.group.community') }}</h4>
              <ul class="mt-4 space-y-3 text-sm text-gray-400">
                <li><a href="https://discord.gg/Z6FtfgWBDa" target="_blank" class="transition-all duration-200 hover:text-accent">Discord</a></li>
                <li><a href="https://www.tiktok.com/@unitylands.cc" target="_blank" class="transition-all duration-200 hover:text-accent">TikTok</a></li>
                <li><a href="https://t.me/unitylands" target="_blank" class="transition-all duration-200 hover:text-accent">Telegram</a></li>
                <li><a href="https://www.youtube.com/@UnityLands" target="_blank" class="transition-all duration-200 hover:text-accent">YouTube</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white">{{ i18n.t('footer.group.support') }}</h4>
              <ul class="mt-4 space-y-3 text-sm text-gray-400">
                <li><a href="#" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.support.faq') }}</a></li>
                <li><a href="https://discord.gg/Z6FtfgWBDa" target="_blank" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.support.contact') }}</a></li>
                <li><a href="#" class="transition-all duration-200 hover:text-accent">{{ i18n.t('footer.group.support.status') }}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="mt-12 flex flex-col items-center gap-4 border-t border-white/5 pt-8 sm:flex-row sm:justify-between"
        >
          <p class="text-sm text-gray-500">{{ i18n.t('footer.copyright') }}</p>
          <div class="flex gap-4">
            @for (social of socials; track social.label) {
              <a
                [href]="social.url"
                target="_blank"
                [attr.aria-label]="social.label"
                class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-all duration-200 hover:border-accent/40 hover:text-accent"
              >
                <app-icon [name]="social.icon" class="text-base" />
              </a>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly i18n = inject(I18nService);

  protected readonly socials = [
    { label: 'Discord', icon: 'chat', url: 'https://discord.gg/Z6FtfgWBDa' },
    { label: 'TikTok', icon: 'smart_display', url: 'https://www.tiktok.com/@unitylands.cc' },
    { label: 'Telegram', icon: 'send', url: 'https://t.me/unitylands' },
    { label: 'YouTube', icon: 'play_circle', url: 'https://www.youtube.com/@UnityLands' },
    { label: 'Instagram', icon: 'photo_camera', url: 'https://www.instagram.com/unitylands.cc' },
    { label: 'Сайт', icon: 'language', url: 'https://unitylands.cc/' },
  ];
}
