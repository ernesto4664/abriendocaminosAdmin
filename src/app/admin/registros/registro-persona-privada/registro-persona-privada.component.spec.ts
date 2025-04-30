import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPersonaPrivadaComponent } from './registro-persona-privada.component';

describe('RegistroPersonaPrivadaComponent', () => {
  let component: RegistroPersonaPrivadaComponent;
  let fixture: ComponentFixture<RegistroPersonaPrivadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPersonaPrivadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPersonaPrivadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
