import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegistradosComponent } from './usuarios-registrados.component';

describe('UsuariosRegistradosComponent', () => {
  let component: UsuariosRegistradosComponent;
  let fixture: ComponentFixture<UsuariosRegistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosRegistradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
