import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UnauthGuard } from './unauth.guard';

describe('UnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientTestingModule, RouterTestingModule ],
      providers: [UnauthGuard]
    });
  });

  it('should redirect to route we specify as a default (my-profile) if someone tries to access it', inject([UnauthGuard], (guard: UnauthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
