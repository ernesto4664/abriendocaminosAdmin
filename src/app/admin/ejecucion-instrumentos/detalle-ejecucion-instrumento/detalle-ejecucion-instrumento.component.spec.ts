import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEjecucionInstrumentoComponent } from './detalle-ejecucion-instrumento.component';

describe('DetalleEjecucionInstrumentoComponent', () => {
  let component: DetalleEjecucionInstrumentoComponent;
  let fixture: ComponentFixture<DetalleEjecucionInstrumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEjecucionInstrumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEjecucionInstrumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
