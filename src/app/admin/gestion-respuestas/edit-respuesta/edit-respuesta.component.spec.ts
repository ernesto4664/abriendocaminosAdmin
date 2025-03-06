import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRespuestaComponent } from './edit-respuesta.component';

describe('EditRespuestaComponent', () => {
  let component: EditRespuestaComponent;
  let fixture: ComponentFixture<EditRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
