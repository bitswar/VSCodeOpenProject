import { Status } from "op-client";
import { QuickPickItem } from "vscode";

export default class WPStatusQuickPickItem implements QuickPickItem {
  label: string;

  picked: boolean;

  status: Status;

  constructor(status: Status, picked = false) {
    this.status = status;
    this.label = status.body.name;
    this.picked = picked;
  }
}
