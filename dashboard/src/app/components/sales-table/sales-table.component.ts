import { Component, input, output, viewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableColumn, SortConfig, Venda } from '../../models/venda.model';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesTableComponent implements AfterViewInit {
  readonly sales = input.required<readonly Venda[]>();
  readonly sort = input.required<SortConfig>();
  readonly sortChange = output<SortableColumn>();
  readonly selectSale = output<Venda>();

  // Controle de scroll horizontal com sombras indicativas (UX mobile)
  readonly scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  scrollLeft = 0;
  maxScroll = 0;

  ngAfterViewInit(): void {
    setTimeout(() => this.updateScrollState(), 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateScrollState();
  }

  onSort(column: SortableColumn): void {
    this.sortChange.emit(column);
  }

  onSelect(venda: Venda): void {
    this.selectSale.emit(venda);
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.scrollLeft = el.scrollLeft;
    this.maxScroll = el.scrollWidth - el.clientWidth;
  }

  private updateScrollState(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      this.scrollLeft = el.scrollLeft;
      this.maxScroll = el.scrollWidth - el.clientWidth;
    }
  }

  isSortedBy(column: SortableColumn): boolean {
    return this.sort().column === column;
  }

  isDescending(): boolean {
    return this.sort().direction === 'desc';
  }
}
