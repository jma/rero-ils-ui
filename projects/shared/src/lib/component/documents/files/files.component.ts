/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, inject } from "@angular/core";
import { ApiService } from "@rero/ng-core";
import { Record, RecordService } from "@rero/ng-core";
import { PrimeNGConfig } from "primeng/api";
import { forkJoin, map, switchMap } from "rxjs";

// file interface
export interface File {
  // thumbnail URL
  thumbnail: string;
  // downloand URL
  download: string;
  // thumbnail legend
  label: string;
}

@Component({
  selector: "shared-doc-files",
  templateUrl: "./files.component.html",
  styleUrl: "./files.component.scss",
})
export class FilesComponent implements OnInit {

  // input document pid
  @Input() documentPid: string;

  // list of files
  files : Array<File> = [];

  // responsive option for primeng
  responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5,
      numScroll: 5,
    },
    {
      breakpoint: "768px",
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: "560px",
      numVisible: 2,
      numScroll: 2,
    },
  ];

  // primeng configuration service
  private ngConfigService = inject(PrimeNGConfig);
  // http service
  private httpService = inject(HttpClient);
  // ng-core record service
  private recordService =  inject(RecordService);
  // ng-core api service
  private apiService = inject(ApiService);

  // contructor
  constructor() {
    // to avoid primeng error
    // TODO: remove this when primeng will be fixed
    this.ngConfigService.translation.aria.slideNumber = "{slideNumber}";
  }

  getIcon(file) {
    const mimetype = file.mimetype;
    if (mimetype == null) {
      return 'fa-file-o';
    }
    switch (true) {
      case mimetype.startsWith('image/'):
        return 'fa-file-image-o';
      case mimetype.startsWith('audio/'):
        return 'fa-file-audio-o';
      case mimetype.startsWith('text/'):
        return 'fa-file-text-o';
      case mimetype.startsWith('video/'):
        return 'fa-file-video-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml'):
        return 'fa-file-powerpoint-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml'):
        return 'fa-file-word-o'
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml'):
        return 'fa-file-excel-o'
      case mimetype.startsWith('application/pdf'):
        return 'fa-file-pdf-o'
    }
    return 'fa-file-o';
  }

  /** OnInit hook */
  ngOnInit() {
    const baseUrl = this.apiService.getEndpointByType('records');
    // retrieve all records files linked to a given document pid
    var query = `metadata.links.keyword:doc_${this.documentPid}`;
    this.httpService
      .get(`${baseUrl}?q=${query}`)
      .pipe(
        map((result: Record) =>
          this.recordService.totalHits(result.hits.total) === 0
            ? []
            : result.hits.hits
        ),
        map((hits: any[]) => hits.map((hit: any) => hit.id)),
        // get all files attached to the given records
        switchMap((ids: any[]) => {
          const obs = ids.map((id) => {
            return this.httpService.get(`${baseUrl}/${id}/files`).pipe(
              map((res: any) => {
                return {
                  id: id,
                  entries: res.entries,
                };
              })
            );
          });
          return forkJoin(obs);
        })
      )
      .subscribe((res: any[]) => {
        var files = [];
        res.map((rec: any) => {
          const data = {};
          // retrieve main files
          rec.entries.map((entry) => {
            // main file (such as pdf)
            if (!["thumbnail", "fulltext"].includes(entry?.metadata?.type)) {
              data[entry.key] = {
                label: entry?.metadata?.label ? entry.metadata.label : entry.key,
                mimetype: entry.mimetype,
                download: `${baseUrl}/${rec.id}/files/${entry.key}/content`,
              };
            }
          });
          // retrieve thumbnails
          rec.entries.map((entry) => {
            if (entry?.metadata?.thumbnail_for && data[entry?.metadata?.thumbnail_for]) {
              data[entry.metadata.thumbnail_for].thumbnail = `${baseUrl}/${rec.id}/files/${entry.key}/content`;
            }
          });
          Object.values(data).map((d: File) => files.push(d));
        });
        files.sort((a, b) => a.label.localeCompare(b.label));
        this.files = files;
      });
  }

  /** invenio previewer
   *
   * TODO
   */
  preview(file: File) {}
}
