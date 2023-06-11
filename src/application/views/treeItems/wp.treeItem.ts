import { WP } from "op-client";
import path from "path";
import * as vscode from "vscode";
import { TreeItem, TreeItemCollapsibleState, TreeItemLabel, Uri } from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import getIconPathByStatus from "../../../utils/getIconPathByStatus.util";

export default class WPTreeItem implements TreeItem {
  collapsibleState?: TreeItemCollapsibleState | undefined;

  description?: string;

  iconPath?: string | Uri;

  label?: string | TreeItemLabel | undefined;

  constructor(wp: WP) {
    const iconPath = getIconPathByStatus(wp.status.self.title as WPStatus);
    const type = wp.type?.self.title;
    let label = `#${wp.id} ${wp.subject}`;
    if (type) label += ` ${type}`;
    this.label = {
      label,
      highlights: [
        [0, Math.floor(Math.log10(Math.abs(wp.id))) + 2],
        [label.length - (type?.length ?? 0), label.length],
      ],
    };
    this.collapsibleState =
      wp.children?.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;
    this.iconPath = iconPath
      ? vscode.Uri.file(path.join(__dirname, iconPath))
      : undefined;
  }
}
