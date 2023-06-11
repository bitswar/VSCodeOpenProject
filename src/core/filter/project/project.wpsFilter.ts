import { injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import ProjectWPsFilter from "./project.wpsFilter.interface";

@injectable()
export default class ProjectWPsFilterImpl implements ProjectWPsFilter {
  private _projectIds?: number[] = undefined;

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  filter(wps: WP[]): WP[] {
    return wps.filter(
      (wp) =>
        this._projectIds === undefined ||
        this._projectIds.includes(wp.project.id),
    );
  }

  onFilterUpdated = this._onFilterUpdated.event;

  getProjectFilter(): number[] | undefined {
    return this._projectIds;
  }

  setProjectFilter(projectIds: number[]): void {
    this._projectIds = projectIds;
    this._onFilterUpdated.fire();
  }
}
