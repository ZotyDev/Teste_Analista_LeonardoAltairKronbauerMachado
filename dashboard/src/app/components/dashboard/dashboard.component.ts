import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { SalesService } from '../../services/sales';
import { OrderStatus, SortableColumn, Venda } from '../../models/venda.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { SalesFilterComponent } from '../sales-filter/sales-filter.component';
import { SalesTableComponent } from '../sales-table/sales-table.component';
import { SaleDetailPanelComponent } from '../sale-detail-panel/sale-detail-panel.component';
import { ExportCsvComponent } from '../export-csv/export-csv.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { BrlCurrencyPipe } from '../../pipes/brl-currency.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    SalesFilterComponent,
    SalesTableComponent,
    SaleDetailPanelComponent,
    ExportCsvComponent,
    PaginationComponent,
    BrlCurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly salesService = inject(SalesService);

  // Dados reativos do serviço
  readonly allSales = toSignal(this.salesService.filteredSales$, { initialValue: [] as Venda[] });
  readonly stats$ = this.salesService.getDashboardStats();
  readonly sort$ = this.salesService.sort$;
  readonly filters = toSignal(this.salesService.filters$);

  // Estado local do componente
  readonly selectedVenda = signal<Venda | null>(null);
  readonly filterCliente = signal('');
  readonly filterStatus = signal<OrderStatus | ''>('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  // Reseta para página 1 quando filtros mudam
  private readonly resetPageEffect = effect(() => {
    this.filters();
    this.currentPage.set(1);
  });

  readonly totalItems = computed(() => this.allSales().length);

  readonly paginatedSales = computed(() => {
    const sales = this.allSales();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return sales.slice(start, start + size);
  });

  readonly isFiltered = computed(() => {
    const f = this.filters();
    return !!f?.cliente || !!f?.status;
  });

  onFilterChange(): void {
    this.salesService.updateFilters({
      cliente: this.filterCliente(),
      status: this.filterStatus(),
    });
  }

  clearFilters(): void {
    this.filterCliente.set('');
    this.filterStatus.set('');
    this.salesService.clearFilters();
  }

  sortBy(column: SortableColumn): void {
    this.salesService.updateSort(column);
  }

  selectVenda(venda: Venda): void {
    this.selectedVenda.set(venda);
  }

  closeDetail(): void {
    this.selectedVenda.set(null);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}
