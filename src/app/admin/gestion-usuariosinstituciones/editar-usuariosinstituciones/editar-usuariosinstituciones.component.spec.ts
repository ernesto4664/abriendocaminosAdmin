import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuariosinstitucionesComponent } from './editar-usuariosinstituciones.component';

describe('EditarUsuariosinstitucionesComponent', () => {
  let component: EditarUsuariosinstitucionesComponent;
  let fixture: ComponentFixture<EditarUsuariosinstitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarUsuariosinstitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarUsuariosinstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
