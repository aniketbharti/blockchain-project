import { TestBed } from '@angular/core/testing';

import { EtheriumService } from './etherium.service';

describe('EtheriumServiceService', () => {
  let service: EtheriumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtheriumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
