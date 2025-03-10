import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRespuestasComponent } from './listar-respuestas.component';

describe('ListarRespuestasComponent', () => {
  let component: ListarRespuestasComponent;
  let fixture: ComponentFixture<ListarRespuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarRespuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
