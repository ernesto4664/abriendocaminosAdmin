import { TestBed } from '@angular/core/testing';

import { TerritoriosService } from './territorios.service';

describe('TerritoriosService', () => {
  let service: TerritoriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerritoriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
