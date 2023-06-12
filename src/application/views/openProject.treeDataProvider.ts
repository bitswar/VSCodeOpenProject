import { inject, injectable } from "inversify";
import { Project, WP } from "op-client";
import * as vscode from "vscode";
import { Event, ProviderResult, TreeItem } from "vscode";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../../infrastructure/openProject/openProject.client.interface";
import ProjectRepository from "../../infrastructure/project/project.repository.interface";
import WPRepository from "../../infrastructure/workPackage/wp.repository.interface";
import OpenProjectTreeDataProvider from "./openProjectTreeDataProvider.interface";
import ProjectTreeItem from "./treeItems/project.treeItem";
import WPTreeItem from "./treeItems/wp.treeItem";

@injectable()
export default class OpenProjectTreeDataProviderImpl
  implements OpenProjectTreeDataProvider
{
  private _onDidChangeTreeData: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onDidChangeTreeData: Event<void> = this._onDidChangeTreeData.event;

  constructor(
    @inject(TOKENS.wpRepository)
    private readonly _wpRepository: WPRepository,
    @inject(TOKENS.projectRepository)
    private readonly _projectRepository: ProjectRepository,
    @inject(TOKENS.opClient)
    _client: OpenProjectClient,
  ) {
    _wpRepository.onWPsChange(() => this._onDidChangeTreeData.fire());
    _projectRepository.onProjectsChange(() => this._onDidChangeTreeData.fire());
    _client.onInit(this.refresh, this);
  }

  getTreeItem(element: WP | Project): TreeItem {
    if (element instanceof WP) return new WPTreeItem(element);
    if (element instanceof Project) return new ProjectTreeItem(element);
    return {};
  }

  getChildren(
    parentElement?: WP | Project | undefined,
  ): ProviderResult<WP[] | Project[]> {
    if (!parentElement) {
      return this._projectRepository.findAll();
    }
    if (parentElement instanceof Project) {
      return this._wpRepository.findByProjectId(parentElement.id);
    }
    return this._wpRepository.findByParentId(parentElement.id);
  }

  getParent(element: WP | Project): ProviderResult<WP | Project | undefined> {
    if (element instanceof Project) return undefined;
    if (element.parent) return this._wpRepository.findById(element.parent.id);
    return this._projectRepository.findById(element.project.id);
  }

  resolveTreeItem(item: TreeItem): ProviderResult<TreeItem> {
    return item;
  }

  refresh(): Promise<void> {
    return Promise.all([
      this._wpRepository.refetch(),
      this._projectRepository.refetch(),
    ]).then();
  }
}
