import * as vscode from "vscode";
import container from "./DI/container";
import TOKENS from "./DI/tokens";
import AuthorizeClientCommand from "./application/commands/authorize/authorizeClientCommand.interface";
import RefreshWPsCommand from "./application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProvider from "./application/views/openProject.treeDataProvider";

export function activate(context: vscode.ExtensionContext) {
  const authCommand = container.get<AuthorizeClientCommand>(
    TOKENS.authorizeCommand,
  );
  const refreshCommand = container.get<RefreshWPsCommand>(
    TOKENS.refreshWPsCommand,
  );
  const treeView = container.get<OpenProjectTreeDataProvider>(
    TOKENS.opTreeView,
  );

  const components = [
    vscode.commands.registerCommand(
      "openproject.auth",
      authCommand.authorizeClient,
    ),
    vscode.commands.registerCommand(
      "openproject.refresh",
      refreshCommand.refreshWPs,
    ),
    vscode.window.createTreeView("openproject-workspaces", {
      treeDataProvider: treeView,
    }),
  ];

  context.subscriptions.push(...components);

  authCommand.authorizeClient();
}

export function deactivate() {}
