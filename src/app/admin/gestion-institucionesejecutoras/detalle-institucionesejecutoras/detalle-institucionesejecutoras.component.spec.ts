import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInstitucionesejecutorasComponent } from './detalle-institucionesejecutoras.component';

describe('GestionConvocatoriasComponent', () => {
  let component: DetalleInstitucionesejecutorasComponent;
  let fixture: ComponentFixture<DetalleInstitucionesejecutorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInstitucionesejecutorasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInstitucionesejecutorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
