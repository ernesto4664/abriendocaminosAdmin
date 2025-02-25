import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTerritoriosComponent } from './listar-territorios.component';

describe('ListarTerritoriosComponent', () => {
  let component: ListarTerritoriosComponent;
  let fixture: ComponentFixture<ListarTerritoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTerritoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTerritoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
