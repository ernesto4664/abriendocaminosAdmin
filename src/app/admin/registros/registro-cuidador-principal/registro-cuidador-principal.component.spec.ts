import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCuidadorPrincipalComponent } from './registro-cuidador-principal.component';

describe('RegistroCuidadorPrincipalComponent', () => {
  let component: RegistroCuidadorPrincipalComponent;
  let fixture: ComponentFixture<RegistroCuidadorPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroCuidadorPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroCuidadorPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
