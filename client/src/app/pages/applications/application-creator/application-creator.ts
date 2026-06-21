import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DatePicker } from '../../../components/date-picker/date-picker';
import { Select } from '../../../components/select/select';

interface RoleOption {
  id: string;
  label: string;
}

interface BackgroundTemplate {
  id: string;
  label: string;
  css: string;
}

@Component({
  selector: 'app-application-creator',
  imports: [FormsModule, DatePicker, Select],
  template: `
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Main column: editor + duration params -->
      <div class="space-y-5 lg:col-span-2">
        <section
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <label class="mb-1 block text-sm text-gray-400">Назва заявки</label>
          <input
            class="auth-input"
            placeholder="Напр. Набір у команду підтримки"
            [(ngModel)]="title"
          />
          <p
            class="mt-1 text-right text-xs"
            [class.text-red-400]="wordCount(title) > titleMaxWords"
            [class.text-gray-500]="wordCount(title) <= titleMaxWords"
          >
            {{ wordCount(title) }} / {{ titleMaxWords }} слів
          </p>

          <!-- Rich text toolbar -->
          <label class="mb-1 mt-4 block text-sm text-gray-400">Тіло заявки</label>
          <div
            class="flex flex-wrap items-center gap-1 rounded-t-xl border border-white/10 bg-surface-2 p-2"
          >
            <button type="button" class="rte-btn font-bold" (mousedown)="$event.preventDefault()" (click)="exec('bold')">B</button>
            <button type="button" class="rte-btn italic" (mousedown)="$event.preventDefault()" (click)="exec('italic')">I</button>
            <button type="button" class="rte-btn underline" (mousedown)="$event.preventDefault()" (click)="exec('underline')">U</button>

            <span class="mx-1 h-5 w-px bg-white/10"></span>

            <div class="relative">
              <button
                type="button"
                class="rte-btn px-2"
                (mousedown)="$event.preventDefault()"
                (click)="fontMenu.set(!fontMenu())"
              >
                Розмір
              </button>
              @if (fontMenu()) {
                <div
                  class="absolute left-0 top-full z-50 mt-1 w-36 rounded-xl border border-white/10 bg-surface-2 p-1 shadow-xl"
                >
                  @for (s of fontSizes; track s.value) {
                    <button
                      type="button"
                      class="flex w-full rounded-lg px-3 py-1.5 text-left text-sm text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
                      (mousedown)="$event.preventDefault()"
                      (click)="exec('fontSize', s.value); fontMenu.set(false)"
                    >
                      {{ s.label }}
                    </button>
                  }
                </div>
              }
            </div>

            <label class="rte-btn relative cursor-pointer" title="Колір тексту">
              A
              <input
                type="color"
                class="absolute inset-0 cursor-pointer opacity-0"
                (mousedown)="$event.stopPropagation()"
                (input)="exec('foreColor', $any($event.target).value)"
              />
            </label>

            <span class="mx-1 h-5 w-px bg-white/10"></span>

            @for (e of emojis; track e) {
              <button
                type="button"
                class="rte-btn"
                (mousedown)="$event.preventDefault()"
                (click)="exec('insertText', e)"
              >
                {{ e }}
              </button>
            }
          </div>

          <div
            #editor
            contenteditable="true"
            class="max-h-80 min-h-40 overflow-y-auto rounded-b-xl border border-t-0 border-white/10 bg-surface-2 p-4 text-sm text-gray-100 focus:outline-none"
            data-placeholder="Опишіть заявку, вимоги, що отримає кандидат…"
            (input)="onBodyInput()"
          ></div>
          <p
            class="mt-1 text-right text-xs"
            [class.text-red-400]="bodyWords() > bodyMaxWords"
            [class.text-gray-500]="bodyWords() <= bodyMaxWords"
          >
            {{ bodyWords() }} / {{ bodyMaxWords }} слів
          </p>

          <!-- Media upload -->
          <label class="mb-1 mt-4 block text-sm text-gray-400">
            Зображення / GIF
          </label>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              (click)="uploadOpen.set(true)"
            >
              Завантажити
            </button>
            @if (image()) {
              <div class="flex items-center gap-2">
                <img [src]="image()" alt="" class="h-12 w-12 rounded-lg object-cover" />
                <button
                  type="button"
                  class="text-xs text-red-400 hover:text-red-300"
                  (click)="image.set(null)"
                >
                  Прибрати
                </button>
              </div>
            }
          </div>
        </section>

        <section
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h3 class="mb-4 font-semibold text-white">Тривалість заявки</h3>

          <!-- Duration: by time -->
          <div class="flex items-center justify-between text-sm text-gray-300">
            <span>Обмежити за часом</span>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="closeByTime"
              class="switch"
              [class.switch-on]="closeByTime"
              (click)="closeByTime = !closeByTime"
            ></button>
          </div>
          @if (closeByTime) {
            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <app-date-picker
                placeholder="Початок"
                [min]="minDate"
                [max]="maxDate"
                [(value)]="fromDate"
              />
              <app-date-picker
                placeholder="Кінець"
                [min]="minDate"
                [max]="maxDate"
                [(value)]="toDate"
              />
            </div>
          }

          <!-- Duration: by responses -->
          <div class="mt-4 flex items-center justify-between text-sm text-gray-300">
            <span>Обмежити за кількістю відгуків</span>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="closeByResponses"
              class="switch"
              [class.switch-on]="closeByResponses"
              (click)="closeByResponses = !closeByResponses"
            ></button>
          </div>
          @if (closeByResponses) {
            <input
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              class="auth-input mt-2"
              placeholder="Макс. відгуків (напр. 20)"
              [(ngModel)]="maxResponses"
              (keydown)="blockNonInteger($event)"
            />
          }
        </section>

        <button
          type="button"
          class="btn btn-primary w-full"
          [disabled]="!canSubmit()"
          (click)="create()"
        >
          Створити заявку
        </button>

        @if (created()) {
          <p
            class="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent"
          >
            Заявку створено (демо — без збереження).
          </p>
        }
      </div>

      <!-- Sidebar: role, visibility, background, info -->
      <div class="space-y-5">
        <section
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h3 class="mb-4 font-semibold text-white">Параметри</h3>

          <label class="mb-1 block text-sm text-gray-400">
            Мінімальна роль для подачі
          </label>
          <app-select [(value)]="minRole" [options]="roleOptions" />

          <div class="mt-4 flex items-center justify-between text-sm text-gray-300">
            <span>Створено від сайту</span>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="fromSite"
              class="switch"
              [class.switch-on]="fromSite"
              (click)="fromSite = !fromSite"
            ></button>
          </div>
        </section>

        <!-- Background template -->
        <section
          class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h3 class="mb-4 font-semibold text-white">Фон заявки</h3>
          <div class="grid grid-cols-2 gap-2">
            @for (bg of backgrounds; track bg.id) {
              <button
                type="button"
                class="h-16 rounded-xl border text-xs font-medium transition-all duration-200"
                [class]="
                  background() === bg.id
                    ? 'border-accent text-white'
                    : 'border-white/10 text-gray-300 hover:border-white/30'
                "
                [style.background]="bg.css || 'var(--color-surface-2)'"
                (click)="background.set(bg.id)"
              >
                {{ bg.label }}
              </button>
            }
          </div>
        </section>

        <!-- Meta -->
        <section
          class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur-md"
        >
          <h3 class="mb-3 font-semibold text-white">Інформація</h3>
          <div class="flex justify-between py-1">
            <span class="text-gray-400">Автор</span>
            <span class="text-white">{{ author() }}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-gray-400">Створено</span>
            <span class="text-white">{{ now }}</span>
          </div>
        </section>
      </div>
    </div>

    <!-- Upload modal -->
    @if (uploadOpen()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        (click)="closeUpload()"
      >
        <div
          class="auth-card relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-2 p-6 shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <h3 class="mb-4 text-lg font-semibold text-white">
            Завантаження зображення
          </h3>

          <label
            class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-surface px-4 py-10 text-center text-sm text-gray-400 transition-all duration-200 hover:border-accent/40"
            (dragover)="$event.preventDefault()"
            (drop)="onDrop($event)"
          >
            <span class="text-2xl">⬆️</span>
            Перетягніть файл сюди або натисніть, щоб обрати
            <input
              type="file"
              accept="image/*,image/gif"
              class="hidden"
              (change)="onPick($event)"
            />
          </label>

          @if (pending()) {
            <img
              [src]="pending()"
              alt=""
              class="mt-4 max-h-48 w-full rounded-xl object-contain"
            />
          }

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="btn btn-ghost btn-sm" (click)="closeUpload()">
              Скасувати
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              [disabled]="!pending()"
              (click)="confirmUpload()"
            >
              Додати
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .rte-btn {
        display: grid;
        place-items: center;
        height: 2rem;
        min-width: 2rem;
        padding: 0 0.4rem;
        border-radius: 0.5rem;
        color: rgb(209 213 219);
        transition: all 0.2s ease;
      }
      .rte-btn:hover {
        background-color: rgb(255 255 255 / 0.08);
        color: #fff;
      }
      .rte-select {
        height: 2rem;
        border-radius: 0.5rem;
        background-color: rgb(255 255 255 / 0.05);
        color: #fff;
        font-size: 0.8125rem;
        padding: 0 0.4rem;
      }
      [contenteditable]:empty::before {
        content: attr(data-placeholder);
        color: rgb(107 114 128);
      }
    `,
  ],
})
export class ApplicationCreator {
  private readonly auth = inject(AuthService);
  private readonly editor = viewChild<ElementRef<HTMLElement>>('editor');

  protected title = '';
  protected minRole = 'user';
  protected closeByTime = false;
  protected fromDate = '';
  protected toDate = '';
  protected closeByResponses = false;
  protected maxResponses = 20;
  protected fromSite = true;

  protected readonly background = signal('none');
  protected readonly image = signal<string | null>(null);
  protected readonly created = signal(false);
  protected readonly fontMenu = signal(false);

  // Word limits
  protected readonly titleMaxWords = 12;
  protected readonly bodyMaxWords = 300;
  protected readonly bodyText = signal('');
  protected readonly bodyWords = computed(() => this.wordCount(this.bodyText()));

  // Upload modal
  protected readonly uploadOpen = signal(false);
  protected readonly pending = signal<string | null>(null);

  protected readonly fontSizes = [
    { value: '2', label: 'Малий' },
    { value: '3', label: 'Звичайний' },
    { value: '5', label: 'Великий' },
    { value: '7', label: 'Заголовок' },
  ];

  protected readonly author = computed(
    () => this.auth.currentUser()?.userName ?? '—',
  );
  protected readonly now = new Date().toLocaleString('uk-UA');

  // Allowed range for the duration pickers: from now to one year ahead.
  protected readonly minDate = this.toLocalInput(new Date());
  protected readonly maxDate = this.toLocalInput(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  );

  protected readonly emojis = ['😀', '🔥', '👍', '🎉', '⭐', '💎', '🛡️', '⚔️'];

  // Roles are hard-coded for now; later this comes from the backend.
  protected readonly roles: RoleOption[] = [
    { id: 'user', label: 'Гравець' },
    { id: 'support', label: 'Підтримка' },
    { id: 'admin', label: 'Адмін' },
    { id: 'owner', label: 'Власник' },
  ];

  protected readonly roleOptions = this.roles.map((r) => ({
    value: r.id,
    label: r.label,
  }));

  protected readonly backgrounds: BackgroundTemplate[] = [
    { id: 'none', label: 'Без фону', css: '' },
    { id: 'blue', label: 'Синій', css: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' },
    { id: 'indigo', label: 'Індиго', css: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
    { id: 'dark', label: 'Темний', css: 'linear-gradient(135deg,#0f172a,#1e293b)' },
  ];

  // Formats a Date as the 'YYYY-MM-DDTHH:mm' string a datetime-local expects.
  private toLocalInput(d: Date): string {
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Allow only whole numbers — block decimal/exponent/sign keys.
  protected blockNonInteger(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-', '.', ','].includes(event.key)) {
      event.preventDefault();
    }
  }

  // Basic rich-text via execCommand — simplest no-library editor for now.
  protected exec(command: string, value?: string): void {
    this.editor()?.nativeElement.focus();
    document.execCommand(command, false, value);
  }

  protected wordCount(text: string): number {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  protected onBodyInput(): void {
    this.bodyText.set(this.editor()?.nativeElement.innerText ?? '');
  }

  protected canSubmit(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.wordCount(this.title) <= this.titleMaxWords &&
      this.bodyWords() <= this.bodyMaxWords
    );
  }

  // ── Upload modal ──
  protected onPick(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.readToPending(file);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.readToPending(event.dataTransfer?.files?.[0]);
  }

  protected confirmUpload(): void {
    this.image.set(this.pending());
    this.closeUpload();
  }

  protected closeUpload(): void {
    this.uploadOpen.set(false);
    this.pending.set(null);
  }

  private readToPending(file: File | undefined): void {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.pending.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected create(): void {
    const payload = {
      title: this.title,
      body: this.editor()?.nativeElement.innerHTML ?? '',
      minRole: this.minRole,
      closeByTime: this.closeByTime,
      from: this.fromDate || null,
      to: this.toDate || null,
      closeByResponses: this.closeByResponses,
      maxResponses: this.closeByResponses ? this.maxResponses : null,
      background: this.background(),
      image: this.image(),
      fromSite: this.fromSite,
      author: this.author(),
      createdAt: new Date().toISOString(),
    };
    // No backend yet — log the payload so the shape is visible.
    console.log('Application payload:', payload);
    this.created.set(true);
  }
}
