import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PositionService } from './position.service';

describe('PositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [PositionService]
  }));

  it('should be created', () => {
    const service: PositionService = TestBed.get(PositionService);
    expect(service).toBeTruthy();
  });
});


