import { QuickPickItem } from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";

export default class WPStatusQuickPickItem implements QuickPickItem {
  label: string;

  picked: boolean;

  status: WPStatus;

  constructor(status: WPStatus, picked = false) {
    this.status = status;
    this.label = status;
    this.picked = picked;
  }
}
