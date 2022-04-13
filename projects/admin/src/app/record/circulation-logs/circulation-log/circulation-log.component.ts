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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '@rero/shared';

@Component({
  selector: 'admin-circulation-log',
  templateUrl: './circulation-log.component.html',
  styleUrls: ['./circulation-log.component.scss']
})
export class CirculationLogComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  @Input() record: any;
  /** Is the log should be highligthed */
  @Input() isHighlight = false;
  /** Is the transaction must be separated from sibling elements */
  @Input() separator = false;

  /** Event for close dialog */
  @Output() closeDialogEvent  = new EventEmitter();

  /** Circulation informations is collapsed */
  isCollapsed = true;
  /** debugMode */
  debugMode = false;

  // GETTER & SETTER ==========================================================
  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this._userService.user.isSystemLibrarian;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _userService - UserService
   */
  constructor(
    private _userService: UserService
  ) {  }

  // COMPONENT FUNCTIONS ======================================================
  /** Close dialog */
  closeDialog(): void {
    this.closeDialogEvent.emit(null);
  }
}
