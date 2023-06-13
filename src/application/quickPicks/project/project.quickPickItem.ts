import { Project } from "op-client";
import { QuickPickItem } from "vscode";

export default class ProjectQuickPickItem implements QuickPickItem {
  label: string;

  description?: string | undefined;

  picked: boolean;

  projectId: number;

  constructor(project: Project, picked = false) {
    this.projectId = project.id;
    this.label = project.body.name ?? `Project #${project.id}`;
    this.description = project.body.description?.raw;
    this.picked = picked;
  }
}
