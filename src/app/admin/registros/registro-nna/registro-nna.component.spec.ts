import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNnaComponent } from './registro-nna.component';

describe('RegistroNnaComponent', () => {
  let component: RegistroNnaComponent;
  let fixture: ComponentFixture<RegistroNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
