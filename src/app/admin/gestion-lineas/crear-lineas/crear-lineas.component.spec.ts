import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearLineasComponent } from './crear-lineas.component';

describe('CrearLineasComponent', () => {
  let component: CrearLineasComponent;
  let fixture: ComponentFixture<CrearLineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearLineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
