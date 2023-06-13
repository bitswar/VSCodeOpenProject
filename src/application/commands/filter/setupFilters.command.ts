import { inject, injectable } from "inversify";
import * as vscode from "vscode";
import TOKENS from "../../../DI/tokens";
import ProjectsFilter from "../../../core/filter/project/project.filter.interface";
import StatusWPsFilter from "../../../core/filter/status/status.wpsFilter.interface";
import TextWPsFilter from "../../../core/filter/text/text.wpsFilter.interface";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import ProjectRepository from "../../../infrastructure/project/project.repository.interface";
import ProjectQuickPick from "../../quickPicks/project/project.quickPick";
import WPStatusQuickPick from "../../quickPicks/wpStatus/wpStatus.quickPick";
import SetupFiltersCommand from "./setupFilters.command.interface";

type PayloadItem<T = unknown> = vscode.QuickPickItem & {
  payload: T;
};

@injectable()
export default class SetupFiltersCommandImpl implements SetupFiltersCommand {
  constructor(
    @inject(TOKENS.textFilter) private readonly _textFilter: TextWPsFilter,
    @inject(TOKENS.projectFilter)
    private readonly _projectFilter: ProjectsFilter,
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
    const projects = this._projectRepo.findAll();
    const oldProjectIds =
      this._projectFilter.getProjectFilter() ?? projects.map((p) => p.id);
    const quickPick = new ProjectQuickPick(
      "Select wps of which projects you want to see: ",
      projects,
      true,
    );
    quickPick.setPickedProjects(oldProjectIds);
    const projectIds = await quickPick.show();
    this._projectFilter.setProjectFilter(projectIds ?? oldProjectIds);
  }

  async setupStatusFilter() {
    const statuses = Object.values(WPStatus);
    const filter = this._statusFilter.getStatusFilter();
    const quickPick = new WPStatusQuickPick(
      "Select wps of which status you want to see: ",
      true,
    );
    quickPick.setPickedStatuses(filter ?? statuses);

    const result = await quickPick.show();

    this._statusFilter.setStatusFilter(result ?? statuses);
  }
}
