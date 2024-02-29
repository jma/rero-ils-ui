import { TestBed } from '@angular/core/testing';

import { ResourcesFilesService } from './resources-files.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordModule } from '@rero/ng-core';
import { TranslateModule } from '@ngx-translate/core';

describe('ResourcesFilesService', () => {
  let service: ResourcesFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RecordModule, TranslateModule.forRoot()]
    });
    service = TestBed.inject(ResourcesFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
