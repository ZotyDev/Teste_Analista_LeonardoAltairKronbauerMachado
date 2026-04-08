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

  describe('sorting', () => {
    const sortTestData: Venda[] = [
      { id: 3, cliente: 'Carlos', data: '2026-04-15', valor: 500, status: 'Pendente', produto: 'Arroz Tipo 2' },
      { id: 1, cliente: 'Ana', data: '2026-04-01', valor: 2000, status: 'Concluído', produto: 'Semente' },
      { id: 4, cliente: 'Diana', data: '2026-04-20', valor: 100, status: 'Cancelado', produto: 'Arroz Tipo 1' },
      { id: 2, cliente: 'Bruno', data: '2026-04-10', valor: 1500, status: 'Concluído', produto: 'Arroz Tipo 3' },
    ];

    it('should sort by id ascending', async () => {
      service.updateSort('id');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.id)).toEqual([1, 2, 3, 4]);
    });

    it('should sort by id descending', async () => {
      service.updateSort('id');
      service.updateSort('id');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.id)).toEqual([4, 3, 2, 1]);
    });

    it('should sort by cliente ascending', async () => {
      service.updateSort('cliente');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.cliente)).toEqual(['Ana', 'Bruno', 'Carlos', 'Diana']);
    });

    it('should sort by cliente descending', async () => {
      service.updateSort('cliente');
      service.updateSort('cliente');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.cliente)).toEqual(['Diana', 'Carlos', 'Bruno', 'Ana']);
    });

    it('should sort by data ascending', async () => {
      service.updateSort('data');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.data)).toEqual(['2026-04-01', '2026-04-10', '2026-04-15', '2026-04-20']);
    });

    it('should sort by data descending', async () => {
      service.updateSort('data');
      service.updateSort('data');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.data)).toEqual(['2026-04-20', '2026-04-15', '2026-04-10', '2026-04-01']);
    });

    it('should sort by valor ascending', async () => {
      service.updateSort('valor');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.valor)).toEqual([100, 500, 1500, 2000]);
    });

    it('should sort by valor descending', async () => {
      service.updateSort('valor');
      service.updateSort('valor');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.valor)).toEqual([2000, 1500, 500, 100]);
    });

    it('should sort by status ascending', async () => {
      service.updateSort('status');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.status)).toEqual(['Cancelado', 'Concluído', 'Concluído', 'Pendente']);
    });

    it('should sort by status descending', async () => {
      service.updateSort('status');
      service.updateSort('status');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.status)).toEqual(['Pendente', 'Concluído', 'Concluído', 'Cancelado']);
    });

    it('should sort by produto ascending', async () => {
      service.updateSort('produto');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.produto)).toEqual(['Arroz Tipo 1', 'Arroz Tipo 2', 'Arroz Tipo 3', 'Semente']);
    });

    it('should sort by produto descending', async () => {
      service.updateSort('produto');
      service.updateSort('produto');
      const promise = firstValueFrom(service.filteredSales$);
      httpMock.expectOne('vendas.json').flush(sortTestData);
      const sorted = await promise;

      expect(sorted.map(v => v.produto)).toEqual(['Semente', 'Arroz Tipo 3', 'Arroz Tipo 2', 'Arroz Tipo 1']);
    });
  });
});
