import { computed, Injectable, signal } from '@angular/core';
import { DEFAULT_LANG, Lang, translations } from './translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Active language. Switch it to re-render every translated string. */
  readonly lang = signal<Lang>(DEFAULT_LANG);
  readonly available = computed(() => Object.keys(translations) as Lang[]);

  /**
   * Translate a key for the current language.
   * Reads the `lang` signal, so templates re-evaluate when the language changes.
   */
  readonly t = (key: string): string =>
    translations[this.lang()][key] ?? key;

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }
}
