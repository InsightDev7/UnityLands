import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `{{ name }}`,
  host: { 'class': 'material-symbols-outlined' },
})
export class IconComponent {
  @Input({ required: true }) name!: string;
}
