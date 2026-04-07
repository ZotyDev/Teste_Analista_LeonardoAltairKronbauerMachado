import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportCsvComponent } from './export-csv.component';
import { Venda } from '../../models/venda.model';

describe('ExportCsvComponent', () => {
  let component: ExportCsvComponent;
  let fixture: ComponentFixture<ExportCsvComponent>;

  const mockVendas: Venda[] = [
    { id: 1, cliente: 'Test', data: '2026-04-01', valor: 100, status: 'Concluído', produto: 'P1' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportCsvComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportCsvComponent);
    fixture.componentRef.setInput('data', mockVendas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not export when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();

    const createSpy = vi.spyOn(URL, 'createObjectURL');
    component.export();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should show filtered count when isFiltered', () => {
    fixture.componentRef.setInput('isFiltered', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('1 filtrados');
  });
});
