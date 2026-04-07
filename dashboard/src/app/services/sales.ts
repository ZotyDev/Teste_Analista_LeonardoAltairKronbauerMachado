import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterCriteria, SortableColumn, SortConfig, Venda } from '../models/venda.model';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, catchError, of, retry } from 'rxjs';
import { DashboardStats } from '../models/dashboard.model';

// Serviço central de vendas com gerenciamento reativo de estado (filtros, ordenação)
@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly JSON_URL = 'vendas.json';

  private readonly filterSubject = new BehaviorSubject<FilterCriteria>({ cliente: '', status: '' });
  private readonly sortSubject = new BehaviorSubject<SortConfig>({ column: 'data', direction: 'desc' });

  readonly filters$ = this.filterSubject.asObservable();
  readonly sort$ = this.sortSubject.asObservable();

  // Cache da requisição HTTP com shareReplay para evitar múltiplas chamadas
  private readonly sales$ = this.http.get<Venda[]>(this.JSON_URL).pipe(
    retry({ count: 2, delay: 1000 }),
    catchError(() => of([] as Venda[])),
    shareReplay(1)
  );

  readonly filteredSales$: Observable<Venda[]> = combineLatest([this.sales$, this.filters$, this.sort$]).pipe(
    map(([vendas, filters, sort]) => {
      let result = vendas.filter(v => {
        const matchCliente = !filters.cliente || this.normalizeText(v.cliente).includes(this.normalizeText(filters.cliente));
        const matchStatus = !filters.status || v.status === filters.status;
        return matchCliente && matchStatus;
      });
      return this.sortVendas(result, sort);
    }),
    shareReplay(1)
  );

  // Remove acentos e converte para minúsculas para busca case-insensitive
  private normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private sortVendas(vendas: readonly Venda[], sort: SortConfig): Venda[] {
    return [...vendas].sort((a, b) => {
      const valA = a[sort.column];
      const valB = b[sort.column];
      const cmp = typeof valA === 'number' && typeof valB === 'number'
        ? valA - valB
        : String(valA).localeCompare(String(valB), 'pt-BR');
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.sales$.pipe(
      map(vendas => {
        const concluidas = vendas.filter(v => v.status === 'Concluído');
        // Cálculo monetário em centavos (inteiros) para evitar erros de ponto flutuante
        const faturamentoCents = concluidas.reduce((acc, curr) => acc + Math.round(curr.valor * 100), 0);
        const faturamento = faturamentoCents / 100;
        const ticketMedio = concluidas.length > 0
          ? Math.round(faturamentoCents / concluidas.length) / 100
          : 0;

        return {
          totalVendas: vendas.length,
          vendasConcluidas: concluidas.length,
          vendasCanceladas: vendas.filter(v => v.status === 'Cancelado').length,
          vendasPendentes: vendas.filter(v => v.status === 'Pendente').length,
          faturamentoTotal: faturamento,
          ticketMedio,
        };
      })
    );
  }

  updateFilters(filters: Partial<FilterCriteria>): void {
    this.filterSubject.next({ ...this.filterSubject.value, ...filters });
  }

  clearFilters(): void {
    this.filterSubject.next({ cliente: '', status: '' });
  }

  updateSort(column: SortableColumn): void {
    const current = this.sortSubject.value;
    const direction = current.column === column && current.direction === 'asc' ? 'desc' : 'asc';
    this.sortSubject.next({ column, direction });
  }
}
