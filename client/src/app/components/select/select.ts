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

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  template: `
    <div class="relative">
      <button
        type="button"
        class="auth-input flex w-full items-center justify-between text-left"
        (click)="open.set(!open())"
      >
        <span [class.text-gray-500]="!selectedLabel()">
          {{ selectedLabel() || placeholder() }}
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-gray-400 transition-all duration-200"
          [class.rotate-180]="open()"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      @if (open()) {
        <div
          class="no-scrollbar absolute z-50 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-surface-2 p-1 shadow-xl"
          [class.mt-2]="!up()"
          [class.bottom-full]="up()"
          [class.mb-2]="up()"
        >
          @for (opt of options(); track opt.value) {
            <button
              type="button"
              class="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
              [class.bg-brand-gradient]="opt.value === value()"
              [class.!text-white]="opt.value === value()"
              (click)="select(opt.value)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class Select {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly value = model<string>('');
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('Оберіть…');
  readonly up = input<boolean>(false);

  protected readonly open = signal(false);
  protected readonly selectedLabel = computed(
    () => this.options().find((o) => o.value === this.value())?.label ?? '',
  );

  protected select(value: string): void {
    this.value.set(value);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
