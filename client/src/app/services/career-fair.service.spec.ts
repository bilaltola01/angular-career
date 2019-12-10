import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CareerFairService } from './career-fair.service';

describe('CareerFairService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CareerFairService]
  }));

  it('should be created', () => {
    const service: CareerFairService = TestBed.get(CareerFairService);
    expect(service).toBeTruthy();
  });
});
