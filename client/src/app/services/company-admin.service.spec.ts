import { TestBed } from '@angular/core/testing';

import { CompanyAdminService } from './company-admin.service';

describe('CompanyAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyAdminService = TestBed.get(CompanyAdminService);
    expect(service).toBeTruthy();
  });
});
