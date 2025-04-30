import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPonderacionComponent } from './editar-ponderacion.component';

describe('EditarPonderacionComponent', () => {
  let component: EditarPonderacionComponent;
  let fixture: ComponentFixture<EditarPonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPonderacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
