import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiVariant = 'gold' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input<string>('');
  readonly variant = input<KpiVariant>('gold');

  protected ringClass(): string {
    const map: Record<KpiVariant, string> = {
      gold: 'ring-slate-100',
      success: 'ring-emerald-100 bg-gradient-to-br from-white to-emerald-50/30',
      warning: 'ring-amber-100 bg-gradient-to-br from-white to-amber-50/30',
      danger: 'ring-red-100 bg-gradient-to-br from-white to-red-50/30',
    };
    return map[this.variant()];
  }

  protected iconBgClass(): string {
    const map: Record<KpiVariant, string> = {
      gold: 'bg-[#C5A059]/10',
      success: 'bg-emerald-100',
      warning: 'bg-amber-100',
      danger: 'bg-red-100',
    };
    return map[this.variant()];
  }

  protected valueClass(): string {
    const map: Record<KpiVariant, string> = {
      gold: 'text-[#4B2317]',
      success: 'text-emerald-600',
      warning: 'text-amber-600',
      danger: 'text-red-600',
    };
    return map[this.variant()];
  }
}
