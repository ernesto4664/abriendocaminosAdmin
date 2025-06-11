import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionInstrumentosComponent } from './ejecucion-instrumentos.component';

describe('EjecucionInstrumentosComponent', () => {
  let component: EjecucionInstrumentosComponent;
  let fixture: ComponentFixture<EjecucionInstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionInstrumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecucionInstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
