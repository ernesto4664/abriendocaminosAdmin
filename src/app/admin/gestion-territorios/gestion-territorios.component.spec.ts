import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTerritoriosComponent } from './gestion-territorios.component';

describe('GestionTerritoriosComponent', () => {
  let component: GestionTerritoriosComponent;
  let fixture: ComponentFixture<GestionTerritoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTerritoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTerritoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
