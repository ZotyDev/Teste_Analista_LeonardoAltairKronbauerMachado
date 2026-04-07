import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesTableComponent } from './sales-table.component';
import { Venda } from '../../models/venda.model';

describe('SalesTableComponent', () => {
  let component: SalesTableComponent;
  let fixture: ComponentFixture<SalesTableComponent>;

  const mockVendas: Venda[] = [
    { id: 1, cliente: 'Test', data: '2026-04-01', valor: 100, status: 'Concluído', produto: 'P1' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesTableComponent);
    fixture.componentRef.setInput('sales', mockVendas);
    fixture.componentRef.setInput('sort', { column: 'data', direction: 'desc' });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sortChange on column click', () => {
    const spy = vi.spyOn(component.sortChange, 'emit');
    component.onSort('valor');
    expect(spy).toHaveBeenCalledWith('valor');
  });

  it('should emit selectSale on row click', () => {
    const spy = vi.spyOn(component.selectSale, 'emit');
    component.onSelect(mockVendas[0]);
    expect(spy).toHaveBeenCalledWith(mockVendas[0]);
  });

  it('should check if sorted by column', () => {
    expect(component.isSortedBy('data')).toBe(true);
    expect(component.isSortedBy('valor')).toBe(false);
  });
});
