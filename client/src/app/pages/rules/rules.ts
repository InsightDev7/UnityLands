import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconComponent } from '../../components/icon/icon';

interface Rule {
  id: string;
  text: string;
  note?: string;
  punishment?: string;
}

interface Section {
  icon: string;
  title: string;
  note?: string;
  allowed?: string;
  rules: Rule[];
}

interface Tab {
  id: number;
  label: string;
  sections: number[];
}

const EMOJI_MAP: Record<string, string> = {
  '❌': 'close',
  '✅': 'check_circle',
  '🔸': 'diamond',
  '▫️': 'fiber_manual_record',
  '📋': 'description',
  '📌': 'push_pin',
  '⚠️': 'warning',
};

@Component({
  selector: 'app-rules',
  imports: [IconComponent],
  template: `
    <main class="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <div class="mb-10">
        <h1 class="text-5xl font-extrabold text-white">
          Правила
        </h1>
        <p class="mt-2 text-base sm:text-lg text-gray-500">
          Unity Lands · Версія 2.0 · Оновлено 13.04.2026
        </p>
        <p class="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed border-l-2 border-accent/40 pl-4">
          Перебуваючи на сервері, ви автоматично погоджуєтеся з усіма його
          правилами та зобов'язуєтеся їх дотримуватися. Незнання правил не
          звільняє від відповідальності.
        </p>
      </div>

      <div class="flex gap-6 sm:gap-8 border-b border-white/10 mb-10">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="activeTab = tab.id"
            class="pb-3 text-base sm:text-lg font-medium transition-all duration-200 cursor-pointer"
            [class]="activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-300'"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @for (section of visibleSections; track section.title) {
        <div class="mb-14 last:mb-0">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <app-icon [name]="section.icon" class="text-accent/80 text-2xl" />
            {{ section.title }}
          </h2>

          @if (section.note) {
            <p class="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed" [innerHTML]="formatText(section.note)"></p>
          }

          <div class="space-y-1">
            @for (rule of section.rules; track rule.id) {
              <div class="flex items-start gap-3 py-2.5">
                @if (rule.id) {
                  <span class="mt-0.5 flex w-10 shrink-0 items-center justify-end text-base font-bold text-accent/80 tabular-nums">{{ rule.id }}</span>
                } @else {
                  <span class="mt-0.5 w-10 shrink-0"></span>
                }
                <p class="flex-1 text-base sm:text-lg text-gray-200 leading-relaxed" [innerHTML]="formatText(rule.text)">
                </p>
                @if (rule.punishment) {
                  <span class="shrink-0 self-start rounded-md bg-red-500/10 px-3 py-1 text-sm sm:text-base font-medium text-red-400 whitespace-nowrap flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">warning</span>
                    {{ rule.punishment }}
                  </span>
                }
              </div>
              @if (!$last) {
                <div class="border-b border-white/5"></div>
              }
            }
          </div>

          @if (section.allowed) {
            <div class="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <p class="text-base sm:text-lg text-emerald-300 leading-relaxed" [innerHTML]="formatText(section.allowed)"></p>
            </div>
          }
        </div>
      }
    </main>
  `,
})
export class Rules {
  private readonly sanitizer = inject(DomSanitizer);

  protected activeTab = 1;

  protected readonly tabs: Tab[] = [
    { id: 1, label: 'Основні', sections: [0, 2] },
    { id: 2, label: 'Правила чату', sections: [1] },
    { id: 3, label: 'Геймплей та території', sections: [3, 4, 5, 6, 7] },
    { id: 4, label: 'Персонал', sections: [8] },
    { id: 5, label: 'Додатково', sections: [9] },
  ];

  protected get visibleSections(): Section[] {
    const tab = this.tabs.find((t) => t.id === this.activeTab);
    return tab ? tab.sections.map((i) => this.sections[i]) : [];
  }

  protected formatText(text: string): SafeHtml {
    let html = text;
    for (const [emoji, icon] of Object.entries(EMOJI_MAP)) {
      const escaped = emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(escaped, 'g'), `<span class="material-symbols-outlined align-middle text-base text-accent/70 -mt-0.5">${icon}</span>`);
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  protected readonly sections: Section[] = [
    {
      icon: 'diamond',
      title: '1. Загальні правила та акаунт',
      rules: [
        { id: '2.0', text: 'Заборонено використовувати лазівки у правилах для власної вигоди.', punishment: 'Бан 12 годин ➔ 1 тиждень' },
        { id: '2.1', text: 'Власники та персонал не несуть відповідальності за ваші невиправдані очікування від проєкту.', punishment: 'Не передбачене' },
        { id: '2.2', text: 'Кожен гравець зобов\'язаний повідомляти про порушення правил іншими гравцями.', punishment: 'На розсуд адміністрації' },
        { id: '2.3', text: 'Ви відповідаєте за безпеку свого акаунта. Злам не звільняє від відповідальності за порушення, скоєні третіми особами.', punishment: 'На розсуд адміністрації' },
        { id: '2.4', text: 'Заборонено обхід покарань (VPN, твінки, повторні акаунти тощо).', punishment: 'Бан назавжди' },
        { id: '2.5', text: 'Заборонено передавати доступ до акаунта іншим гравцям.', punishment: 'Бан усіх причетних назавжди' },
        { id: '2.6', text: 'Заборонено продаж ігрових цінностей за реальні гроші (RMT).', punishment: 'Бан на 1 тиждень' },
      ],
    },
    {
      icon: 'diamond',
      title: '2. Поведінка та етика',
      rules: [
        { id: '2.7', text: 'Заборонені образи, провокації та дискримінація.', punishment: 'Мут 30 хвилин ➔ 24 години' },
        { id: '2.8', text: 'Суворо заборонені образи родичів.', punishment: 'Мут 24 години' },
        { id: '2.9', text: 'Заборонена аморальна поведінка (чорний гумор тощо).', punishment: 'Мут 30 хвилин' },
        { id: '2.10', text: 'Заборонена пропаганда нацизму, суїциду та незаконних дій.', punishment: 'Бан назавжди' },
        { id: '2.11', text: 'Заборонено поширення особистих даних, шантаж та погрози.', punishment: 'Бан назавжди' },
        { id: '2.12', text: 'Заборонено поширення шкідливого ПЗ та мошенництво.', punishment: 'Бан назавжди' },
        { id: '2.13', text: 'Суворо заборонено контент 18+ (насильство/дитячий контент).', punishment: 'Бан назавжди' },
      ],
    },
    {
      icon: 'diamond',
      title: '3. Ігровий процес та будівництво',
      rules: [
        { id: '2.14', text: 'Заборонені образливі нікнейми, скіни або плащі.', punishment: 'Прохання змінити ➔ Бан назавжди' },
        { id: '2.15', text: 'Заборонена побудова заборонених символів (екстремістських тощо).', punishment: 'Бан 12 годин + видалення будівлі' },
        { id: '2.16', text: 'Заборонено обговорення політики. Сервер — для гри та відпочинку.', punishment: 'Мут 1 година' },
        { id: '2.17', text: 'Заборонено спам, флуд та капс.', punishment: 'Мут 1 година' },
        { id: '2.18', text: 'Заборонено неузгоджений піар.', punishment: 'Бан назавжди' },
        { id: '2.19', text: 'Заборонено жебракування (креатив, ролі тощо).', punishment: 'Мут 5 хвилин ➔ 24 години' },
      ],
    },
    {
      icon: 'diamond',
      title: '4. Використання ПЗ та модів',
      note: 'СУВОРО ЗАБОРОНЕНО використання чіт-клієнтів (Meteor, Impact, Wurst, Celestial тощо), а також:',
      rules: [
        { id: '', text: '❌ X-Ray, Baritone, Speedhack, Fly, KillAura' },
        { id: '', text: '❌ Використання багів, дюпів, Freecam, AutoTotem, ElytraBoost' },
        { id: '', text: '❌ Моди для крашу сервера, пошуку сіда світу або фантомних блоків' },
        { id: '', text: 'Покарання:', note: 'Бан назавжди' },
      ],
      allowed: '✅ Оптимізація та QoL-моди (Sodium, Optifine, Iris) ✅ Індикатори броні / ефектів (AppleSkin) ✅ Schematic, ReplayMod, Litematica ✅ Zoom, Міні-карта (без показу данжів/гравців), AutoFish ✅ Автоклікер (тільки для фармілок мобів)',
    },
    {
      icon: 'diamond',
      title: '5. Ігрові зони та території',
      rules: [
        { id: '2.26', text: 'Сервер розділений на спеціальні зони з різними правилами та механіками.' },
        { id: '', text: '▫️ Зона спавну — PvP: заборонено, Будівництво: заборонено (доступ лише для гравців з роллю Discord "Builder"). Територія: 420×420 навколо (0,0)' },
        { id: '', text: '▫️ Приватна територія — Доступ: тільки власник. Власник може встановлювати власні правила, якщо вони не суперечать загальним.' },
        { id: '', text: '▫️ Територія клану — Доступ: члени клану. Лідер може встановлювати власні правила, якщо вони не суперечать загальним.' },
        { id: '', text: '▫️ Загальна територія — PvP: заборонено, Будівництво: вільне, Ресурси: спільні' },
        { id: '', text: '▫️ Фермерські зони — PvP: заборонено, Автофіш: дозволено, Бонус до врожаю: +25%' },
        { id: '', text: '▫️ Зони подій — Тимчасові. Правила встановлюються окремо для кожного івенту.' },
      ],
    },
    {
      icon: 'diamond',
      title: '5.1 Правила PvP-зони',
      rules: [
        { id: '2.27', text: 'На цій території діють особливі умови бою. Входячи сюди, ви погоджуєтесь із наступним:' },
        { id: '', text: '🔸 Повна свобода — Дозволені будь-які ігрові механіки, зілля та тактики. Ви дієте на власний ризик.' },
        { id: '', text: '🔸 Режим бою — Активується при першому ударі й триває 15 секунд. Кожна атака оновлює таймер. ⚠️ Вихід із гри під час бою карається миттєвою смертю та випадінням усіх речей.' },
        { id: '', text: '🔸 Унікальні трофеї — Голова гравця випадає лише за умови, що його вбив інший гравець у чесному поєдинку. При смерті від мобів, вогню або падіння голова не випадає. Усі випавші ресурси є законною здобиччю переможця.' },
        { id: '', text: '⚠️ Адміністрація не повертає речі, втрачені в бою або через вихід із сервера під час активного таймера.' },
      ],
    },
    {
      icon: 'diamond',
      title: '6. PvP та бойові зони',
      rules: [
        { id: '2.35', text: 'PvP дозволене ТІЛЬКИ у спеціально визначених PvP-зонах сервера.' },
        { id: '2.36', text: 'PvP заборонене на території спавну, на приватній території гравців (крім випадків, дозволених власником), на території кланів (крім випадків, дозволених кланом), поза офіційними PvP-зонами.' },
        { id: '2.37', text: 'Нав\'язування PvP, випадкові вбивства та переслідування гравців заборонені.', punishment: 'Кік / Тимчасовий бан / Бан (на розсуд адміністрації)' },
        { id: '2.38', text: 'Гриферство суворо заборонене: руйнування чужих споруд, крадіжка, підриви, підпали, затоплення, навмисне ламання ферм та механізмів.' },
      ],
    },
    {
      icon: 'diamond',
      title: '7. Лаг-машини та AFK',
      rules: [
        { id: '2.39', text: 'AFK та AFK-ферми дозволені, якщо вони не створюють велике навантаження на сервер.' },
        { id: '2.40', text: 'Заборонено створювати лаг-машини або механізми, що викликають перевантаження сервера.', punishment: 'Видалення ➔ Тимчасовий бан ➔ Бан назавжди (у разі відмови прибрати)' },
        { id: '', text: '📋 Технічні правила: Максимальний розмір ферми: 50×50 блоків. Заборонено створювати безкінечні редстоун-цикли. Ліміт мобів на чанк: 30 (без урахування ферм). Заборонені конструкції, що викликають падіння FPS.' },
      ],
    },
    {
      icon: 'shield',
      title: 'Правила для персоналу',
      rules: [
        { id: '2.41', text: 'Дотримуватися правил сервера та допомагати гравцям.' },
        { id: '2.42', text: 'Заборонено зловживати владою або використовувати її для власної вигоди.' },
        { id: '2.43', text: 'Заборонено розголошувати координати гравців або дані з адмін-каналів.' },
        { id: '2.44', text: 'Модератор має бути стриманим. За порушення — зняття з посади.' },
        { id: '2.45', text: 'Модератори мають право видавати покарання на власний розсуд у спірних ситуаціях.' },
      ],
    },
    {
      icon: 'settings',
      title: 'Додаткові механіки',
      rules: [
        { id: '', text: '🔸 Ванільність та привати: На нашому сервері немає штучних приватів територій (команд /claim чи /res). Ми граємо у форматі повної ваніли, де безпека базується на взаємній повазі.' },
        { id: '', text: '🔸 Відкати та компенсації: Ми не повертаємо речі, втрачені внаслідок ігрового процесу (смерть у лаві, вибух кріпера, падіння). Відкат інвентарю можливий тільки у випадку доведеного гриферства (після перевірки логів) або критичного технічного збою сервера.' },
        { id: '', text: '🔸 Адмін-втручання: Адміністрація не видає ресурси ("дай алмаз"), не змінює час/погоду за проханням та не втручається в локальні конфлікти, які не порушують глобальні правила сервера.' },
        { id: '', text: '🔸 Бани: Речі гравців, які перебувають у бані, не передаються третім особам.' },
        { id: '', text: '📌 Важливо: Основна мова спілкування — українська (вас повинні розуміти). Використання цензури чи завуальованих образ не звільняє від відповідальності. Адміністрація залишає за собою право змінювати правила.' },
      ],
    },
  ];
}
