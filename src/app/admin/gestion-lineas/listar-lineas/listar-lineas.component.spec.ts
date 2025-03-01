import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLineasComponent } from './listar-lineas.component';

describe('ListarLineasComponent', () => {
  let component: ListarLineasComponent;
  let fixture: ComponentFixture<ListarLineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLineasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
