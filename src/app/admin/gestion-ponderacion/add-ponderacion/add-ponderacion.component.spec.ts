import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPonderacionComponent } from './add-ponderacion.component';

describe('AddPonderacionComponent', () => {
  let component: AddPonderacionComponent;
  let fixture: ComponentFixture<AddPonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPonderacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
