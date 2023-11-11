import { TestBed } from '@angular/core/testing';

import { LayersService } from './layers.service';
import { HttpClientModule } from '@angular/common/http';

describe('LayersService', () => {
  let service: LayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(LayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
