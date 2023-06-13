import * as vscode from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPStatusQuickPickItem from "./wpStatus.quickPickItem";

export default class WPStatusQuickPick<T extends true | false = false> {
  private readonly _items: WPStatusQuickPickItem[];

  private readonly _title: string;

  private readonly _multiSelect: boolean;

  constructor(title: string, multiSelect: T) {
    this._title = title;
    this._multiSelect = multiSelect;
    this._items = this.getStatusQuickPickItems();
  }

  public setPickedStatuses(statuses: WPStatus[]) {
    statuses.forEach((status) => {
      const statusItem = this._items.find((item) => item.status === status);
      if (statusItem) statusItem.picked = true;
    });
  }

  show<
    TResult = (T extends true ? WPStatus[] : WPStatus) | undefined,
  >(): Thenable<TResult> {
    return (
      vscode.window.showQuickPick(this._items, {
        canPickMany: this._multiSelect,
        title: this._title,
      }) as Thenable<
        | (T extends true ? WPStatusQuickPickItem[] : WPStatusQuickPickItem)
        | undefined
      >
    ).then((result) => {
      if (!result) return undefined;
      if (Array.isArray(result)) return result.map((item) => item.status);
      return result.status;
    }) as Thenable<TResult>;
  }

  private getStatusQuickPickItems(): WPStatusQuickPickItem[] {
    return Object.values(WPStatus).map(
      (status) => new WPStatusQuickPickItem(status),
    );
  }
}
