import { Project } from "op-client";
import * as vscode from "vscode";
import ProjectQuickPickItem from "./project.quickPickItem";

export default class ProjectQuickPick<T extends true | false> {
  private readonly _items: ProjectQuickPickItem[];

  private readonly _multiSelect: boolean;

  private readonly _title: string;

  constructor(title: string, projects: Project[], multiSelect: T) {
    this._items = this.getProjectQuickPickItems(projects);
    this._multiSelect = multiSelect;
    this._title = title;
  }

  setPickedProjects(projects: number[] | Project[]): void {
    projects.forEach((project: number | Project) => {
      const projectItem = this._items.find(
        (item) =>
          item.projectId ===
          (typeof project === "number" ? project : project.id),
      );
      if (projectItem) projectItem.picked = true;
    });
  }

  getProjectQuickPickItems(projects: Project[]): ProjectQuickPickItem[] {
    return projects.map((project) => new ProjectQuickPickItem(project));
  }

  show<
    TResult = (T extends true ? number[] : number) | undefined,
  >(): Thenable<TResult> {
    return (
      vscode.window.showQuickPick(this._items, {
        canPickMany: this._multiSelect,
        title: this._title,
      }) as Thenable<
        | (T extends true ? ProjectQuickPickItem[] : ProjectQuickPickItem)
        | undefined
      >
    ).then((result) => {
      if (!result) return undefined;
      if (Array.isArray(result)) return result.map((item) => item.projectId);
      return result.projectId;
    }) as Thenable<TResult>;
  }
}
