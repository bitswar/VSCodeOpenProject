import { inject, injectable } from "inversify";
import * as vscode from "vscode";
import TOKENS from "../../../DI/tokens";
import OpenProjectClient from "../../../infrastructure/openProject/openProjectClient.interface";
import OpenProjectTreeDataProvider from "../../views/openProjectTreeDataProvider.interface";
import AuthorizeClientCommand from "./authorizeClientCommand.interface";

@injectable()
export default class AuthorizeClientCommandImpl
  implements AuthorizeClientCommand
{
  constructor(
    @inject(TOKENS.opTreeView)
    private readonly _treeDataProvider: OpenProjectTreeDataProvider,
    @inject(TOKENS.opClient)
    private readonly _client: OpenProjectClient,
  ) {}

  async authorizeClient() {
    const config = vscode.workspace.getConfiguration("openproject");
    const user = await this._client.init(
      config.get("base_url") ?? "",
      config.get("token") ?? "",
    );
    if (!user) {
      vscode.window.showErrorMessage("Failed connecting to OpenProject");
      return;
    }
    vscode.commands.executeCommand("setContext", "openproject.authed", true);
    vscode.window.showInformationMessage(
      `Hello, ${user.firstName} ${user.lastName}!`,
    );
    this._treeDataProvider.refreshWPs();
  }
}
