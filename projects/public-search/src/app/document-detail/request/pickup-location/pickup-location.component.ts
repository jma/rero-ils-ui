/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';

@Component({
  selector: 'public-search-pickup-location',
  templateUrl: './pickup-location.component.html'
})
export class PickupLocationComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /** View code */
  @Input() viewcode: string;

  /** Close request dialog event */
  @Output() closeEvent = new EventEmitter<boolean>();

  /** Form */
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};

  /** Show form */
  showForm = true;

  /** Request in progress */
  requestInProgress = false;

  /** Item requested */
  requested = false;

  /** User message */
  requestMessage: {
    success: boolean,
    message: string
  };

  /**
   * Construtor
   * @param _locationApiService - LocationApiService
   * @param _itemApiService - ItemApiService
   * @param _translateService - TranslateService
   */
  constructor(
    private _locationApiService: LocationApiService,
    private _itemApiService: ItemApiService,
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._locationApiService
      .getPickupLocationsByItemId(this.item.metadata.pid)
      .subscribe((pickups: any) => {
        const options = [];
        pickups.forEach((pickup: any) => {
          options.push({label: pickup.name, value: pickup.pid });
        });
        this.fields.push({
          key: `pickup`,
          type: 'select',
          templateOptions: {
            label: this._translateService.instant('Pickup location'),
            required: true,
            options
          }
        });
      });
  }

  /** Close request dialog */
  closeDialog(): void {
    this.closeEvent.emit(true);
  }

  /** Submit form */
  submit() {
    this.requestInProgress = true;
    this._itemApiService.request({
      item_pid: this.item.metadata.pid,
      pickup_location_pid: this.model.pickup,
    })
    .pipe(tap(() => {
      this.showForm = false;
      this.requestInProgress = false;
      this.requested = true;
    }))
    .subscribe(
      () => {
        this.requestMessage = {
          success: true,
          message: this._translateService.instant('A request has been placed on this item.')
        };
      },
      () => {
        this.requestMessage = {
          success: false,
          message: this._translateService.instant('Error on this request.')
        };
      }
    );
  }
}
