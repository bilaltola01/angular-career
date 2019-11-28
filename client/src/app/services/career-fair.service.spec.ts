import { TestBed } from '@angular/core/testing';

import { CareerFairService } from './career-fair.service';

describe('CareerFairService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CareerFairService = TestBed.get(CareerFairService);
    expect(service).toBeTruthy();
  });
});
