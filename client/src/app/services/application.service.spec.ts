import { TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApplicationService } from './application.service';

=======
import { ApplicationService } from './application.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';

>>>>>>> Implemented Pagination and Improved UI.
describe('ApplicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ApplicationService]
  }));

<<<<<<< HEAD
=======

>>>>>>> Implemented Pagination and Improved UI.
  it('should be created', () => {
    const service: ApplicationService = TestBed.get(ApplicationService);
    expect(service).toBeTruthy();
  });
});
