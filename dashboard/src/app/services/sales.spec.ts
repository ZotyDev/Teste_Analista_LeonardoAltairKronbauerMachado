import { TestBed } from '@angular/core/testing';
import { SalesService } from './sales';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Venda } from '../models/venda.model';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

describe('SalesService', () => {
  let service: SalesService;
  let httpMock: HttpTestingController;

  const mockVendas: Venda[] = [
    { id: 1, cliente: 'Empresa A', data: '2026-04-01', valor: 1000, status: 'Concluído', produto: 'Semente' },
    { id: 2, cliente: 'Empresa B', data: '2026-04-02', valor: 2000, status: 'Concluído', produto: 'Arroz Tipo 1' },
    { id: 3, cliente: 'Empresa C', data: '2026-04-03', valor: 5000, status: 'Cancelado', produto: 'Arroz Tipo 2' },
    { id: 4, cliente: 'Empresa D', data: '2026-04-04', valor: 1500, status: 'Pendente', produto: 'Arroz Tipo 3' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SalesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should calculate DashboardStats correctly', async () => {
    const statsPromise = firstValueFrom(service.getDashboardStats());
    httpMock.expectOne('vendas.json').flush(mockVendas);
    const stats = await statsPromise;

    expect(stats.faturamentoTotal).toBe(3000);
    expect(stats.ticketMedio).toBe(1500);
    expect(stats.vendasConcluidas).toBe(2);
    expect(stats.vendasCanceladas).toBe(1);
    expect(stats.vendasPendentes).toBe(1);
    expect(stats.totalVendas).toBe(4);
  });

  it('should handle zero completed sales safely', async () => {
    const onlyCancelled: Venda[] = [
      { id: 1, cliente: 'X', data: '2026-01-01', valor: 500, status: 'Cancelado', produto: 'P1' }
    ];
    const statsPromise = firstValueFrom(service.getDashboardStats());
    httpMock.expectOne('vendas.json').flush(onlyCancelled);
    const stats = await statsPromise;

    expect(stats.ticketMedio).toBe(0);
    expect(stats.faturamentoTotal).toBe(0);
    expect(stats.vendasConcluidas).toBe(0);
  });

  it('should filter sales by cliente name', async () => {
    service.updateFilters({ cliente: 'Empresa A' });
    const promise = firstValueFrom(service.filteredSales$);
    httpMock.expectOne('vendas.json').flush(mockVendas);
    const filtered = await promise;

    expect(filtered.length).toBe(1);
    expect(filtered[0].cliente).toBe('Empresa A');
  });

  it('should filter ignoring accents', async () => {
    const vendasWithAccent: Venda[] = [
      { id: 1, cliente: 'João Silva', data: '2026-04-01', valor: 100, status: 'Concluído', produto: 'P1' },
    ];
    service.updateFilters({ cliente: 'joao' });
    const promise = firstValueFrom(service.filteredSales$);
    httpMock.expectOne('vendas.json').flush(vendasWithAccent);
    const filtered = await promise;

    expect(filtered.length).toBe(1);
  });

  it('should filter sales by status', async () => {
    service.updateFilters({ status: 'Cancelado' });
    const promise = firstValueFrom(service.filteredSales$);
    httpMock.expectOne('vendas.json').flush(mockVendas);
    const filtered = await promise;

    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('Cancelado');
  });

  it('should clear filters correctly', async () => {
    service.updateFilters({ cliente: 'Empresa A', status: 'Concluído' });
    service.clearFilters();
    const promise = firstValueFrom(service.filteredSales$);
    httpMock.expectOne('vendas.json').flush(mockVendas);
    const filtered = await promise;

    expect(filtered.length).toBe(4);
  });

  it('should sort by column', async () => {
    service.updateSort('valor');
    const promise = firstValueFrom(service.filteredSales$);
    httpMock.expectOne('vendas.json').flush(mockVendas);
    const sorted = await promise;

    expect(sorted[0].valor).toBe(1000);
  });
});
