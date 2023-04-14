import { TestBed } from '@angular/core/testing';

import { DatabackendService } from './databackend.service';

describe('DatabackendService', () => {
  let service: DatabackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
