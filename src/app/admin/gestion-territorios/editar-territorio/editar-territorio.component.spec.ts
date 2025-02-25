import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTerritorioComponent } from './editar-territorio.component';

describe('EditarTerritorioComponent', () => {
  let component: EditarTerritorioComponent;
  let fixture: ComponentFixture<EditarTerritorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTerritorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTerritorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
