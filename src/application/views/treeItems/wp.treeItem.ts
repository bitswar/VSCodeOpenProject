import { WP } from "op-client";
import path from "path";
import * as vscode from "vscode";
import { TreeItem, TreeItemCollapsibleState, TreeItemLabel, Uri } from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import getIconPathByStatus from "../../../utils/getIconPathByStatus.util";

export default class WPTreeItem implements TreeItem {
  collapsibleState: TreeItemCollapsibleState | undefined;

  description?: string;

  iconPath?: string | Uri;

  label: string | TreeItemLabel;

  contextValue = "wp";

  constructor(wp: WP) {
    this.label = this.resolveLabel(wp.id, wp.subject, wp.type?.self.title);
    this.collapsibleState = this.resolveCollapsibleState(wp);
    this.iconPath = this.resolveIcon(wp.status?.self.title as WPStatus);
  }

  private resolveLabel(
    id: number,
    subject: string,
    type?: string,
  ): TreeItemLabel {
    let label = `#${id} ${subject}`;
    if (type) label += ` ${type}`;
    return {
      label,
      highlights: [
        [0, Math.floor(Math.log10(Math.abs(id))) + 2],
        [label.length - (type?.length ?? 0), label.length],
      ],
    };
  }

  private resolveCollapsibleState(wp: WP): TreeItemCollapsibleState {
    return wp.children?.length > 0
      ? vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
  }

  private resolveIcon(status: WPStatus): Uri | undefined {
    const iconPath = getIconPathByStatus(status);
    return iconPath
      ? vscode.Uri.file(path.join(__dirname, iconPath))
      : undefined;
  }
}
