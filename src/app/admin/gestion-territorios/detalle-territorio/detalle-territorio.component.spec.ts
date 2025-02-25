import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTerritorioComponent } from './detalle-territorio.component';

describe('DetalleTerritorioComponent', () => {
  let component: DetalleTerritorioComponent;
  let fixture: ComponentFixture<DetalleTerritorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleTerritorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleTerritorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
