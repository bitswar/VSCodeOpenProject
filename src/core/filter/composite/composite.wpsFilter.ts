import { injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import WPsFilter from "../wpsFilter.interface";
import CompositeWPsFilter from "./composite.wpsFilter.interface";

@injectable()
export default class CompositeWPsFilterImpl implements CompositeWPsFilter {
  private _filters: WPsFilter[] = [];

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onFilterUpdated = this._onFilterUpdated.event;

  filter(wps: WP[]): WP[] {
    let filteredWps: WP[] = wps;
    for (let i = 0; i < this._filters.length; i++) {
      filteredWps = this._filters[i].filter(filteredWps);
    }
    return filteredWps;
  }

  pushFilter(filter: WPsFilter): void {
    this._filters.push(filter);
    filter.onFilterUpdated(() => this._onFilterUpdated.fire());
  }
}
