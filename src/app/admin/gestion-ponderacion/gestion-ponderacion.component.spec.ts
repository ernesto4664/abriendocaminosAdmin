import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPonderacionComponent } from './gestion-ponderacion.component';

describe('GestionPonderacionComponent', () => {
  let component: GestionPonderacionComponent;
  let fixture: ComponentFixture<GestionPonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPonderacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
