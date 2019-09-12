import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchingService } from './matching.service';

describe('MatchingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [MatchingService]
  }));

  it('should be created', () => {
    const service: MatchingService = TestBed.get(MatchingService);
    expect(service).toBeTruthy();
  });
});
