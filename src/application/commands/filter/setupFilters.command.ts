import { inject, injectable } from "inversify";
import * as vscode from "vscode";
import TOKENS from "../../../DI/tokens";
import ProjectWPsFilter from "../../../core/filter/project/project.wpsFilter.interface";
import StatusWPsFilter from "../../../core/filter/status/status.wpsFilter.interface";
import TextWPsFilter from "../../../core/filter/text/text.wpsFilter.interface";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import ProjectRepository from "../../../infrastructure/project/project.repository.interface";
import ProjectQuickPickItem from "./quickPickItems/project.quickPickItem";
import WPStatusQuickPickItem from "./quickPickItems/wpStatus.quickPickItem";
import SetupFiltersCommand from "./setupFilters.command.interface";

export type PayloadItem<T = unknown> = vscode.QuickPickItem & {
  payload: T;
};

@injectable()
export default class SetupFiltersCommandImpl implements SetupFiltersCommand {
  constructor(
    @inject(TOKENS.textFilter) private readonly _textFilter: TextWPsFilter,
    @inject(TOKENS.projectFilter)
    private readonly _projectFilter: ProjectWPsFilter,
    @inject(TOKENS.statusFilter)
    private readonly _statusFilter: StatusWPsFilter,
    @inject(TOKENS.projectRepository)
    private readonly _projectRepo: ProjectRepository,
  ) {}

  async setupFilters() {
    const items: PayloadItem<() => unknown>[] = [
      {
        label: "Text filter",
        description: "Filters packages by text query",
        payload: () => this.setupTextFilter(),
      },
      {
        label: "Project filter",
        description: "Choose which packages you want to show",
        payload: () => this.setupProjectFilter(),
      },
      {
        label: "Status filter",
        description: "Filters packages by it's status",
        payload: () => this.setupStatusFilter(),
      },
    ];
    const filterTypeItem = await vscode.window.showQuickPick(items);
    filterTypeItem?.payload();
  }

  async setupTextFilter() {
    const textFilter = await vscode.window.showInputBox({
      placeHolder: "Your text filter",
      title: "Text filter",
      value: this._textFilter.getTextFilter(),
    });
    this._textFilter.setTextFilter(textFilter ?? "");
  }

  async setupProjectFilter() {
    const items = this.getProjectIdQuickPickItems();
    const results = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      title: "Select wps of which projects you want to see: ",
    });
    const projectIds = (results ?? items).map((item) => item.projectId);
    this._projectFilter.setProjectFilter(projectIds);
  }

  async setupStatusFilter() {
    const items = this.getStatusQuickPickItems();
    const results = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      title: "Select wps of which status you want to see: ",
    });
    const statuses = (results ?? items).map((item) => item.status);
    this._statusFilter.setStatusFilter(statuses);
  }

  getProjectIdQuickPickItems(): ProjectQuickPickItem[] {
    const filter = this._projectFilter.getProjectFilter();
    const projects = this._projectRepo.findAll();
    return projects.map(
      (project) =>
        new ProjectQuickPickItem(
          project,
          filter === undefined || filter.includes(project.id),
        ),
    );
  }

  getStatusQuickPickItems(): WPStatusQuickPickItem[] {
    const filter = this._statusFilter.getStatusFilter();
    return Object.values(WPStatus).map(
      (status) =>
        new WPStatusQuickPickItem(
          status,
          filter === undefined || filter.includes(status),
        ),
    );
  }
}
