import { TestBed } from '@angular/core/testing';

import { CompanyRecruiterService } from './company-recruiter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompanyRecruiterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CompanyRecruiterService]
  }));

  it('should be created', () => {
    const service: CompanyRecruiterService = TestBed.get(CompanyRecruiterService);
    expect(service).toBeTruthy();
  });
});
