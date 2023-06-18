import { Project } from "op-client";
import { TreeItem, TreeItemCollapsibleState, TreeItemLabel } from "vscode";

export default class ProjectTreeItem implements TreeItem {
  collapsibleState?: TreeItemCollapsibleState | undefined;

  description?: string;

  label?: string | TreeItemLabel | undefined;

  constructor(project: Project) {
    this.label = project.body.name;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
    this.description = project.body.description?.raw;
  }
}
