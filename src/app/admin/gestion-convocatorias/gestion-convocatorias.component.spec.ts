import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConvocatoriasComponent } from './gestion-convocatorias.component';

describe('GestionConvocatoriasComponent', () => {
  let component: GestionConvocatoriasComponent;
  let fixture: ComponentFixture<GestionConvocatoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionConvocatoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionConvocatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
