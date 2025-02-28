import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInstitucionesejecutorasComponent } from './gestion-institucionesejecutoras.component';

describe('GestionConvocatoriasComponent', () => {
  let component: GestionInstitucionesejecutorasComponent;
  let fixture: ComponentFixture<GestionInstitucionesejecutorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInstitucionesejecutorasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInstitucionesejecutorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
