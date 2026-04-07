import { Component, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../models/venda.model';

@Component({
  selector: 'app-sales-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sales-filter.component.html',
  styleUrl: './sales-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesFilterComponent {
  readonly cliente = model<string>('');
  readonly status = model<OrderStatus | ''>('');
  readonly filterChange = output<void>();
  readonly clear = output<void>();

  get hasFilters(): boolean {
    return !!this.cliente() || !!this.status();
  }
}
