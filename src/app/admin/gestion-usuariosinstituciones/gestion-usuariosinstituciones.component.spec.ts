import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUsuariosinstitucionesComponent } from './gestion-usuariosinstituciones.component';

describe('GestionUsuariosinstitucionesComponent', () => {
  let component: GestionUsuariosinstitucionesComponent;
  let fixture: ComponentFixture<GestionUsuariosinstitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUsuariosinstitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionUsuariosinstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
