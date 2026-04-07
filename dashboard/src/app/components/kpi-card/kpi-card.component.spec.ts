import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('value', '100');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label and value', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test Label');
    expect(el.textContent).toContain('100');
  });

  it('should apply correct variant classes', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    expect(component['ringClass']()).toContain('emerald');
  });
});
