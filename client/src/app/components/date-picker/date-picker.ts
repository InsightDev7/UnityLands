import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Select } from '../select/select';

interface Cell {
  day: number | null;
  disabled: boolean;
}

@Component({
  selector: 'app-date-picker',
  imports: [Select],
  template: `
    <div class="relative">
      <!-- Trigger -->
      <button
        type="button"
        class="auth-input flex w-full items-center justify-between text-left"
        (click)="open.set(!open())"
      >
        <span [class.text-gray-500]="!value()">
          {{ value() ? display() : placeholder() }}
        </span>
        <svg
          class="h-4 w-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      @if (open()) {
        <div
          class="absolute z-50 mt-2 w-72 rounded-2xl border border-white/10 bg-surface-2 p-4 shadow-xl"
        >
          <!-- Month header -->
          <div class="mb-3 flex items-center justify-between">
            <button
              type="button"
              class="grid h-7 w-7 place-items-center rounded-lg text-gray-300 hover:bg-white/5 hover:text-white"
              (click)="shiftMonth(-1)"
            >
              ‹
            </button>
            <span class="text-sm font-semibold text-white">{{ monthLabel() }}</span>
            <button
              type="button"
              class="grid h-7 w-7 place-items-center rounded-lg text-gray-300 hover:bg-white/5 hover:text-white"
              (click)="shiftMonth(1)"
            >
              ›
            </button>
          </div>

          <!-- Weekday row -->
          <div class="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500">
            @for (w of weekdays; track w) {
              <span>{{ w }}</span>
            }
          </div>

          <!-- Days -->
          <div class="mt-1 grid grid-cols-7 gap-1">
            @for (cell of cells(); track $index) {
              @if (cell.day === null) {
                <span></span>
              } @else {
                <button
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-lg text-sm transition-all duration-200"
                  [class]="dayClass(cell)"
                  [disabled]="cell.disabled"
                  (click)="selectDay(cell.day)"
                >
                  {{ cell.day }}
                </button>
              }
            }
          </div>

          <!-- Time -->
          <div class="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
            <span class="text-xs text-gray-400">Час</span>
            <div class="flex-1">
              <app-select
                [up]="true"
                [value]="hourStr()"
                (valueChange)="setHour($event)"
                [options]="hourOptions"
              />
            </div>
            <span class="text-gray-500">:</span>
            <div class="flex-1">
              <app-select
                [up]="true"
                [value]="minuteStr()"
                (valueChange)="setMinute($event)"
                [options]="minuteOptions"
              />
            </div>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-sm mt-3 w-full"
            (click)="open.set(false)"
          >
            ОК
          </button>
        </div>
      }
    </div>
  `,
})
export class DatePicker {
  private readonly host = inject(ElementRef<HTMLElement>);

  // Two-way bound value, format: 'YYYY-MM-DDTHH:mm' (datetime-local style).
  readonly value = model<string>('');
  readonly min = input<string>('');
  readonly max = input<string>('');
  readonly placeholder = input<string>('Оберіть дату');

  protected readonly open = signal(false);
  // First day of the currently displayed month.
  protected readonly view = signal(this.startOfMonth(new Date()));

  protected readonly weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly minutes = Array.from({ length: 60 }, (_, i) => i);
  protected readonly hourOptions = this.hours.map((h) => ({
    value: String(h),
    label: this.pad(h),
  }));
  protected readonly minuteOptions = this.minutes.map((m) => ({
    value: String(m),
    label: this.pad(m),
  }));

  private readonly selected = computed(() => this.parse(this.value()));
  protected readonly hour = computed(() => this.selected()?.getHours() ?? 0);
  protected readonly minute = computed(() => this.selected()?.getMinutes() ?? 0);
  protected readonly hourStr = computed(() => String(this.hour()));
  protected readonly minuteStr = computed(() => String(this.minute()));

  protected readonly monthLabel = computed(() =>
    this.view().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' }),
  );

  protected readonly display = computed(() => {
    const d = this.selected();
    if (!d) return '';
    return `${this.pad(d.getDate())}.${this.pad(d.getMonth() + 1)}.${d.getFullYear()}, ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  });

  protected readonly cells = computed<Cell[]>(() => {
    const first = this.view();
    const year = first.getFullYear();
    const month = first.getMonth();
    const lead = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Cell[] = [];
    for (let i = 0; i < lead; i++) cells.push({ day: null, disabled: true });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, disabled: this.isDisabled(year, month, d) });
    }
    return cells;
  });

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected shiftMonth(delta: number): void {
    const v = this.view();
    this.view.set(new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  protected selectDay(day: number): void {
    const v = this.view();
    const cur = this.selected();
    this.emit(
      new Date(v.getFullYear(), v.getMonth(), day, cur?.getHours() ?? 0, cur?.getMinutes() ?? 0),
    );
  }

  protected setHour(h: string): void {
    const base = this.selected() ?? new Date();
    this.emit(
      new Date(base.getFullYear(), base.getMonth(), base.getDate(), +h, base.getMinutes()),
    );
  }

  protected setMinute(m: string): void {
    const base = this.selected() ?? new Date();
    this.emit(
      new Date(base.getFullYear(), base.getMonth(), base.getDate(), base.getHours(), +m),
    );
  }

  protected dayClass(cell: Cell): string {
    if (cell.disabled) return 'text-gray-600 cursor-not-allowed';
    const sel = this.selected();
    const v = this.view();
    const isSelected =
      sel &&
      sel.getFullYear() === v.getFullYear() &&
      sel.getMonth() === v.getMonth() &&
      sel.getDate() === cell.day;
    return isSelected
      ? 'bg-brand-gradient text-white'
      : 'text-gray-200 hover:bg-white/5';
  }

  @HostListener('document:click', ['$event'])
  protected onDocClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  private emit(date: Date): void {
    this.value.set(this.format(date));
  }

  private isDisabled(year: number, month: number, day: number): boolean {
    const d = new Date(year, month, day);
    const min = this.parse(this.min());
    const max = this.parse(this.max());
    if (min && d < this.startOfDay(min)) return true;
    if (max && d > max) return true;
    return false;
  }

  private parse(value: string): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private format(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}T${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
  }

  private startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}
