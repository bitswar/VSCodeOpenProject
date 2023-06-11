import { injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import TextWPsFilter from "./text.wpsFilter.interface";

@injectable()
export default class TextWPsFilterImpl implements TextWPsFilter {
  private _textFilter = "";

  private _onFilterUpdated: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  filter(wps: WP[]): WP[] {
    const textFilterLower = this._textFilter.toLowerCase();
    return wps.filter(
      (wp) =>
        wp.author.login.toLowerCase().includes(textFilterLower) ||
        wp.author.firstName.toLowerCase().includes(textFilterLower) ||
        wp.author.lastName.toLowerCase().includes(textFilterLower) ||
        wp.author.name.toLowerCase().includes(textFilterLower) ||
        wp.subject.toLowerCase().includes(textFilterLower) ||
        wp.body.description?.raw.toLowerCase().includes(textFilterLower),
    );
  }

  getTextFilter(): string {
    return this._textFilter;
  }

  setTextFilter(nameFilter: string): void {
    this._textFilter = nameFilter;
    this._onFilterUpdated.fire();
  }

  onFilterUpdated = this._onFilterUpdated.event;
}
