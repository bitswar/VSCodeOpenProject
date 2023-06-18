import { inject, injectable } from "inversify";
import { Project } from "op-client";
import * as vscode from "vscode";
import { Event } from "vscode";
import TOKENS from "../../DI/tokens";
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
  ) {}

  findById(id: number): Project {
    const result = this._projects.find((wp) => wp.id === id);
    if (!result) throw new ProjectNotFoundException();
    return result;
  }

  findAll(): Project[] {
    return this._projects;
  }

  refetch(): Promise<void> {
    return this._client.getProjects().then((projects) => {
      this._projects = projects;
      this._onProjectsChange.fire();
    });
  }
}
