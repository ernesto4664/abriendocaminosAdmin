import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRespuestaComponent } from './delete-respuesta.component';

describe('DeleteRespuestaComponent', () => {
  let component: DeleteRespuestaComponent;
  let fixture: ComponentFixture<DeleteRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
