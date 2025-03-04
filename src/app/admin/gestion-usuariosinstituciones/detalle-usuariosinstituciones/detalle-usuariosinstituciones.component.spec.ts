import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleUsuariosinstitucionesComponent } from './detalle-usuariosinstituciones.component';

describe('DetalleUsuariosinstitucionesComponent', () => {
  let component: DetalleUsuariosinstitucionesComponent;
  let fixture: ComponentFixture<DetalleUsuariosinstitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleUsuariosinstitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleUsuariosinstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
