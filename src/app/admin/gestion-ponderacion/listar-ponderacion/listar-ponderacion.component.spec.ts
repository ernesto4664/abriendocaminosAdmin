import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPonderacionComponent } from './listar-ponderacion.component';

describe('ListarPonderacionComponent', () => {
  let component: ListarPonderacionComponent;
  let fixture: ComponentFixture<ListarPonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPonderacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
