import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDetalleComponent } from './registro-detalle.component';

describe('RegistroDetalleComponent', () => {
  let component: RegistroDetalleComponent;
  let fixture: ComponentFixture<RegistroDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
