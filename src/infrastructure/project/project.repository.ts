import { inject, injectable } from "inversify";
import { Project } from "op-client";
import * as vscode from "vscode";
import { Event } from "vscode";
import TOKENS from "../../DI/tokens";
import ProjectsFilter from "../../core/filter/project/project.filter.interface";
import OpenProjectClient from "../openProject/openProject.client.interface";
import ProjectRepository from "./project.repository.interface";
import ProjectNotFoundException from "./projectNotFount.exception";

@injectable()
export default class ProjectRepositoryImpl implements ProjectRepository {
  private _projects: Project[] = [];

  private _onProjectsChange: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onProjectsChange: Event<void> = this._onProjectsChange.event;

  constructor(
    @inject(TOKENS.opClient) private readonly _client: OpenProjectClient,
    @inject(TOKENS.projectFilter) private readonly _filter: ProjectsFilter,
  ) {
    _filter.onFilterUpdated(() => this._onProjectsChange.fire());
  }

  getFilteredProjects() {
    return this._filter.filter(this._projects);
  }

  findById(id: number): Project {
    const result = this.getFilteredProjects().find((wp) => wp.id === id);
    if (!result) throw new ProjectNotFoundException();
    return result;
  }

  findAll(): Project[] {
    return this.getFilteredProjects();
  }

  refetch(): Promise<void> {
    return this._client.getProjects().then((projects) => {
      this._projects = projects;
      this._onProjectsChange.fire();
    });
  }
}
