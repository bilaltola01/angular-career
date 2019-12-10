import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RecruiterGuard } from './role.guard';

describe('RoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientTestingModule, RouterTestingModule ],
      providers: [RecruiterGuard]
    });
  });

  it('should ...', inject([RecruiterGuard], (guard: RecruiterGuard) => {
    expect(guard).toBeTruthy();
  }));
});
