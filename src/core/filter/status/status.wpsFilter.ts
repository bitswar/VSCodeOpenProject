import { injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import StatusWPsFilter from "./status.wpsFilter.interface";

@injectable()
export default class StatusWPsFilterImpl implements StatusWPsFilter {
  private _wpTypesFilter?: WPStatus[] = undefined;

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  filter(wps: WP[]): WP[] {
    return wps.filter(
      (wp) =>
        this._wpTypesFilter === undefined ||
        this._wpTypesFilter.includes(wp.status.self.title as WPStatus),
    );
  }

  onFilterUpdated = this._onFilterUpdated.event;

  setStatusFilter(projectIds: WPStatus[]): void {
    this._wpTypesFilter = projectIds;
    this._onFilterUpdated.fire();
  }

  getStatusFilter(): WPStatus[] | undefined {
    return this._wpTypesFilter;
  }
}
