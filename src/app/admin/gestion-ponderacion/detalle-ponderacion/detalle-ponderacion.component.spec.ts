import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePonderacionComponent } from './detalle-ponderacion.component';

describe('DetallePonderacionComponent', () => {
  let component: DetallePonderacionComponent;
  let fixture: ComponentFixture<DetallePonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePonderacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
