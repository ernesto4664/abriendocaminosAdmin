import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUsuariosinstitucionesComponent } from './listar-usuariosinstituciones.component';

describe('ListarUsuariosinstitucionesComponent', () => {
  let component: ListarUsuariosinstitucionesComponent;
  let fixture: ComponentFixture<ListarUsuariosinstitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarUsuariosinstitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarUsuariosinstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
