import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuariosinstitucionesComponent } from './crear-usuariosinstituciones.component';

describe('CrearUsuariosinstitucionesComponent', () => {
  let component: CrearUsuariosinstitucionesComponent;
  let fixture: ComponentFixture<CrearUsuariosinstitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearUsuariosinstitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUsuariosinstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
