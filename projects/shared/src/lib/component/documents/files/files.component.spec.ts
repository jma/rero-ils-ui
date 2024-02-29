import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FilesComponent } from "./files.component";
import { RecordModule } from "@rero/ng-core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PrimeNGConfig } from "primeng/api";
import { TranslateModule } from "@ngx-translate/core";
import { FormlyModule } from "@ngx-formly/core";

describe("FilesComponent", () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecordModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormlyModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
