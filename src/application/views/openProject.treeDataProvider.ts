import { inject, injectable } from "inversify";
import { WP } from "op-client";
import path from "path";
import * as vscode from "vscode";
import { Event, ProviderResult, TreeItem } from "vscode";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../../infrastructure/openProject/openProject.client";
import getIconPathByStatus from "../../utils/getIconPathByStatus.util";
import OpenProjectTreeDataProvider from "./openProjectTreeDataProvider.interface";

@injectable()
export default class OpenProjectTreeDataProviderImpl
  implements OpenProjectTreeDataProvider
{
  constructor(
    @inject(TOKENS.opClient)
    private readonly _client: OpenProjectClient,
  ) {
    this.refreshWPs();
  }

  private workPackages: WP[] = [];

  private _onDidChangeTreeData: vscode.EventEmitter<
    void | WP | WP[] | null | undefined
  > = new vscode.EventEmitter<void | WP | WP[] | null | undefined>();

  onDidChangeTreeData?: Event<void | WP | WP[] | null | undefined> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: WP): TreeItem | Promise<TreeItem> {
    const iconPath = getIconPathByStatus(element.status.self.title);
    return {
      label: `#${element.id} ${element.subject}`,
      collapsibleState:
        element.children?.length > 0
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None,
      iconPath: iconPath
        ? vscode.Uri.file(path.join(__dirname, iconPath))
        : undefined,
    };
  }

  getChildren(parentElement?: WP | undefined): ProviderResult<WP[]> {
    if (!parentElement) {
      return this.workPackages.filter((wp) => !wp.parent);
    }
    return this.workPackages.filter((wp) => wp.parent?.id === parentElement.id);
  }

  getParent(element: WP): ProviderResult<WP> {
    return this.workPackages.find((wp) => wp.id === element.parent.id);
  }

  resolveTreeItem(item: TreeItem): ProviderResult<TreeItem> {
    return item;
  }

  refreshWPs(): Promise<void> {
    return this._client.getWPs().then((wps) => {
      if (wps.length) {
        this.workPackages = wps;
        this._onDidChangeTreeData.fire();
      }
    });
  }
}
