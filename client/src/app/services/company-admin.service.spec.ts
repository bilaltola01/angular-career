import { TestBed } from '@angular/core/testing';

import { CompanyAdminService } from './company-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompanyAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CompanyAdminService]
  }));

  it('should be created', () => {
    const service: CompanyAdminService = TestBed.get(CompanyAdminService);
    expect(service).toBeTruthy();
  });
});
