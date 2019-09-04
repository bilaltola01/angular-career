import { TestBed } from '@angular/core/testing';

import { CompanyRecruiterService } from './company-recruiter.service';

describe('CompanyRecruiterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyRecruiterService = TestBed.get(CompanyRecruiterService);
    expect(service).toBeTruthy();
  });
});
