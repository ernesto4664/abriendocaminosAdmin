import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLineasComponent } from './gestion-lineas.component';

describe('GestionLineasComponent', () => {
  let component: GestionLineasComponent;
  let fixture: ComponentFixture<GestionLineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
