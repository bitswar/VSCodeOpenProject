import { WP } from "op-client";
import * as vscode from "vscode";
import { Event, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import OpenProjectClient from "../openProject.client";
import getIconPathByStatus from "../utils/getIconPathByStatus.util";
import path from "path";

export default class OpenProjectTreeDataProvider
  implements TreeDataProvider<WP>
{
  private static _instance: OpenProjectTreeDataProvider;

  public static getInstance(): OpenProjectTreeDataProvider {
    if (!this._instance) {
      this._instance = new OpenProjectTreeDataProvider();
    }
    return this._instance;
  }

  private _client: OpenProjectClient;

  private workPackages: WP[] = [];

  private _onDidChangeTreeData: vscode.EventEmitter<
    void | WP | WP[] | null | undefined
  > = new vscode.EventEmitter<void | WP | WP[] | null | undefined>();

  private constructor() {
    this._client = OpenProjectClient.getInstance();
    this.refreshWPs();
  }

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

  getChildren(element?: WP | undefined): ProviderResult<WP[]> {
    if (!element) {
      return this.workPackages.filter((wp) => !wp.parent);
    }
    return this.workPackages.filter((wp) => wp.parent?.id === element.id);
  }

  getParent(element: WP): ProviderResult<WP> {
    return this.workPackages.find((wp) => wp.id === element.parent.id);
  }

  resolveTreeItem(item: TreeItem): ProviderResult<TreeItem> {
    return item;
  }

  refreshWPs(): Promise<void> | undefined {
    return this._client.getWPs()?.then((wps) => {
      if (wps.length) {
        this.workPackages = wps;
        this._onDidChangeTreeData.fire();
      }
    });
  }
}
