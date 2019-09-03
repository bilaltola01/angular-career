import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ScoreService]
  }));

  it('should be created', () => {
    const service: ScoreService = TestBed.get(ScoreService);
    expect(service).toBeTruthy();
  });
});
