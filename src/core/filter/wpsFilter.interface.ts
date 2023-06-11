import { WP } from "op-client";
import * as vscode from "vscode";

export default interface WPsFilter {
  filter(wps: WP[]): WP[];
  onFilterUpdated: vscode.Event<void>;
}
