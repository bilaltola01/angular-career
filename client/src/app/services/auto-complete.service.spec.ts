import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AutoCompleteService } from './auto-complete.service';

describe('AutoCompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AutoCompleteService]
  }));

  it('should be created', () => {
    const service: AutoCompleteService = TestBed.get(AutoCompleteService);
    expect(service).toBeTruthy();
  });
});
