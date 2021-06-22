import { TestBed } from '@angular/core/testing';

import { LogSheetServiceService } from './log-sheet-service.service';

describe('LogSheetServiceService', () => {
  let service: LogSheetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogSheetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
