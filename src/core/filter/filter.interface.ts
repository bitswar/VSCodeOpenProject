import * as vscode from "vscode";

export default interface Filter<T = unknown> {
  filter(items: T[]): T[];
  onFilterUpdated: vscode.Event<void>;
}
