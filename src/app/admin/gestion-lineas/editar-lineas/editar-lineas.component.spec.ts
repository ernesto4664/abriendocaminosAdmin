import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLineasComponent } from './editar-lineas.component';

describe('EditarLineasComponent', () => {
  let component: EditarLineasComponent;
  let fixture: ComponentFixture<EditarLineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
