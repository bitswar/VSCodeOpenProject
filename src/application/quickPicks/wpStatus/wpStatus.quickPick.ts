import { Status } from "op-client";
import * as vscode from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPStatusQuickPickItem from "./wpStatus.quickPickItem";

export default class WPStatusQuickPick<T extends true | false = false> {
  private readonly _items: WPStatusQuickPickItem[];

  private readonly _title: string;

  private readonly _multiSelect: boolean;

  constructor(title: string, statuses: Status[], multiSelect: T) {
    this._title = title;
    this._multiSelect = multiSelect;
    this._items = this.getStatusQuickPickItems(statuses);
  }

  public setPickedStatuses(statuses: (number | WPStatus | Status)[]) {
    statuses.forEach((status) => {
      const statusItem = this._items.find((item) => {
        if (status instanceof Status) return item.status.id === status.id;
        if (typeof status === "number") return item.status.id === status;
        return item.label === status;
      });
      if (statusItem) statusItem.picked = true;
    });
  }

  show<
    TResult = (T extends true ? Status[] : Status) | undefined,
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

  private getStatusQuickPickItems(statuses: Status[]): WPStatusQuickPickItem[] {
    return statuses.map((status) => new WPStatusQuickPickItem(status));
  }
}
