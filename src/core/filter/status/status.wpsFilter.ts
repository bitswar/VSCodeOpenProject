import { injectable } from "inversify";
import { Status, WP } from "op-client";
import * as vscode from "vscode";
import StatusWPsFilter from "./status.wpsFilter.interface";

@injectable()
export default class StatusWPsFilterImpl implements StatusWPsFilter {
  private _wpStatusFilter?: number[] = undefined;

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  filter(wps: WP[]): WP[] {
    return wps.filter(
      (wp) =>
        this._wpStatusFilter === undefined ||
        this._wpStatusFilter.includes(wp.status.id),
    );
  }

  onFilterUpdated = this._onFilterUpdated.event;

  setStatusFilter(statuses: Status[] | number[]): void {
    this._wpStatusFilter = statuses.map((s) => {
      if (typeof s === "number") return s;
      return s.id;
    });
    this._onFilterUpdated.fire();
  }

  getStatusFilter(): number[] | undefined {
    return this._wpStatusFilter;
  }
}
