import { injectable } from "inversify";
import { Project } from "op-client";
import * as vscode from "vscode";
import ProjectsFilter from "./project.filter.interface";

@injectable()
export default class ProjectsFilterImpl implements ProjectsFilter {
  private _projectIds?: number[] = undefined;

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  filter(projects: Project[]): Project[] {
    return projects.filter(
      (project) =>
        this._projectIds === undefined || this._projectIds.includes(project.id),
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
