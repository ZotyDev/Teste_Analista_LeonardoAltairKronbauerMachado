import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesFilterComponent } from './sales-filter.component';

describe('SalesFilterComponent', () => {
  let component: SalesFilterComponent;
  let fixture: ComponentFixture<SalesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange on cliente change', () => {
    const spy = vi.spyOn(component.filterChange, 'emit');
    component.cliente.set('Test');
    component.filterChange.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should report hasFilters correctly', () => {
    expect(component.hasFilters).toBe(false);
    component.cliente.set('Test');
    expect(component.hasFilters).toBe(true);
  });
});
