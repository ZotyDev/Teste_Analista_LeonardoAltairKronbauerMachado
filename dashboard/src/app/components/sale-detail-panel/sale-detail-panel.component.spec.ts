import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleDetailPanelComponent } from './sale-detail-panel.component';
import { Venda } from '../../models/venda.model';

describe('SaleDetailPanelComponent', () => {
  let component: SaleDetailPanelComponent;
  let fixture: ComponentFixture<SaleDetailPanelComponent>;

  const mockVenda: Venda = {
    id: 1,
    cliente: 'Test Client',
    data: '2026-04-01',
    valor: 100,
    status: 'Concluído',
    produto: 'Test Product',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleDetailPanelComponent);
    fixture.componentRef.setInput('venda', mockVenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close on onClose', () => {
    const spy = vi.spyOn(component.close, 'emit');
    component.onClose();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit close on backdrop click', () => {
    const spy = vi.spyOn(component.close, 'emit');
    component.onBackdropClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should display venda data', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test Client');
    expect(el.textContent).toContain('Test Product');
  });
});
