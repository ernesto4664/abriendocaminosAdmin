import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleLineasComponent } from './detalle-lineas.component';

describe('DetalleLineasComponent', () => {
  let component: DetalleLineasComponent;
  let fixture: ComponentFixture<DetalleLineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleLineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
