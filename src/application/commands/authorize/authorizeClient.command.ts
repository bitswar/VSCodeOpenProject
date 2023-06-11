import { inject, injectable } from "inversify";
import * as vscode from "vscode";
import TOKENS from "../../../DI/tokens";
import Logger from "../../../infrastructure/logger/logger.interface";
import OpenProjectClient from "../../../infrastructure/openProject/openProject.client.interface";
import AuthorizeClientCommand from "./authorizeClientCommand.interface";

@injectable()
export default class AuthorizeClientCommandImpl
  implements AuthorizeClientCommand
{
  constructor(
    @inject(TOKENS.opClient)
    private readonly _client: OpenProjectClient,
    @inject(TOKENS.logger)
    private readonly _logger?: Logger,
  ) {
    this._client.onInit(() => {
      this.showMessage();
      this.setAuthedTrue();
    });
  }

  authorizeClient() {
    const config = vscode.workspace.getConfiguration("openproject");
    this._client.init(config.get("base_url") ?? "", config.get("token") ?? "");
  }

  setAuthedTrue() {
    vscode.commands.executeCommand("setContext", "openproject.authed", true);
  }

  showMessage() {
    return this._client
      .getUser()
      .then((user) => {
        vscode.window.showInformationMessage(
          `Hello, ${user.firstName} ${user.lastName}!`,
        );
      })
      .catch((err) => {
        this._logger?.error("Failed connecting to OpenProject: ", err);
        vscode.window.showErrorMessage("Failed connecting to OpenProject");
      });
  }
}
