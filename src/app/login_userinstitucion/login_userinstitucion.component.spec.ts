import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login_UserinstitucionComponent } from './login_userinstitucion.component';

describe('Login_UserinstitucionComponent', () => {
  let component: Login_UserinstitucionComponent;
  let fixture: ComponentFixture<Login_UserinstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login_UserinstitucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login_UserinstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
