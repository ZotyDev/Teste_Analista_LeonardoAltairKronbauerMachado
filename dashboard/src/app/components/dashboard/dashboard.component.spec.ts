import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { Venda } from '../../models/venda.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  const mockVendas: Venda[] = [
    { id: 1, cliente: 'Test Client', data: '2026-04-01', valor: 100, status: 'Concluído', produto: 'Test Product' },
    { id: 2, cliente: 'Another Client', data: '2026-04-02', valor: 200, status: 'Cancelado', produto: 'Product 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush([]);
    expect(component).toBeTruthy();
  });

  it('should select and close venda', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush(mockVendas);

    expect(component.selectedVenda()).toBeNull();
    component.selectVenda(mockVendas[0]);
    expect(component.selectedVenda()).toEqual(mockVendas[0]);
    component.closeDetail();
    expect(component.selectedVenda()).toBeNull();
  });

  it('should update filters', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush(mockVendas);

    component.filterCliente.set('Test');
    component.filterStatus.set('Concluído');
    component.onFilterChange();

    expect(component.filterCliente()).toBe('Test');
    expect(component.filterStatus()).toBe('Concluído');
  });

  it('should clear filters', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush(mockVendas);

    component.filterCliente.set('Test');
    component.clearFilters();

    expect(component.filterCliente()).toBe('');
    expect(component.filterStatus()).toBe('');
  });

  it('should call sortBy', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush(mockVendas);
    expect(() => component.sortBy('valor')).not.toThrow();
  });

  it('should compute isFiltered correctly', () => {
    fixture.detectChanges();
    httpMock.expectOne('vendas.json').flush(mockVendas);

    expect(component.isFiltered()).toBe(false);
    component.filterCliente.set('Test');
    component.onFilterChange();
    expect(component.isFiltered()).toBe(true);
  });
});
