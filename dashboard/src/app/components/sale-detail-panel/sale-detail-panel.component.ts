import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venda } from '../../models/venda.model';

@Component({
  selector: 'app-sale-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-detail-panel.component.html',
  styleUrl: './sale-detail-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDetailPanelComponent {
  readonly venda = input.required<Venda>();
  readonly close = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
