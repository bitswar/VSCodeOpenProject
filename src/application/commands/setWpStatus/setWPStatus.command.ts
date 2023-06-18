import { inject, injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import TOKENS from "../../../DI/tokens";
import StatusRepository from "../../../infrastructure/status/status.repository.interface";
import WPRepository from "../../../infrastructure/workPackage/wp.repository.interface";
import WPStatusQuickPick from "../../quickPicks/wpStatus/wpStatus.quickPick";
import OpenProjectTreeDataProvider from "../../views/openProject.treeDataProvider.interface";
import SetWPStatusCommand from "./setWPStatus.command.interface";

@injectable()
export default class SetWPStatusCommandImpl implements SetWPStatusCommand {
  constructor(
    @inject(TOKENS.wpRepository) private readonly _wpRepo: WPRepository,
    @inject(TOKENS.opTreeView)
    private readonly _treeView: OpenProjectTreeDataProvider,
    @inject(TOKENS.statusRepository)
    private readonly _statusRepo: StatusRepository,
  ) {}

  async setWPStatus(wp: WP): Promise<void> {
    const newWP = wp;
    const statuses = this._statusRepo.findAll();
    const quickPick = new WPStatusQuickPick(
      "Choose new status: ",
      statuses,
      false,
    );
    const newStatus = await quickPick.show();
    if (newStatus) {
      newWP.status = newStatus;
      await this._wpRepo
        .save(wp)
        .then(this.showSuccessMessage)
        .then(() => this.refreshView())
        .catch(this.showFailureMessage);
    }
  }

  private showSuccessMessage() {
    vscode.window.showInformationMessage("WP updated!");
  }

  private showFailureMessage(err: Error) {
    vscode.window.showErrorMessage(`WP was not updated: ${err.message}!`);
  }

  private refreshView() {
    this._treeView.redraw();
  }
}
