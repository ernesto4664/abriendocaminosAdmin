import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTerritorioComponent } from './crear-territorio.component';

describe('CrearTerritorioComponent', () => {
  let component: CrearTerritorioComponent;
  let fixture: ComponentFixture<CrearTerritorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTerritorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTerritorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
