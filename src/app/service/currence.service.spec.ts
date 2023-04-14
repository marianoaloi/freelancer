import { TestBed } from '@angular/core/testing';

import { CurrenceService } from './currence.service';

describe('CurrenceService', () => {
  let service: CurrenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
