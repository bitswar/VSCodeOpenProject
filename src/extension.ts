import * as vscode from "vscode";
import OpenProjectTreeDataProvider from "./views/openProject.treeDataProvider";
import authorizeClient from "./commands/authorizeClient.command";
import refreshWPs from "./commands/refreshWPs.command";

export function activate(context: vscode.ExtensionContext) {
  authorizeClient();
  const authCommand = vscode.commands.registerCommand(
    "openproject.auth",
    authorizeClient,
  );
  const refreshWPsCommand = vscode.commands.registerCommand(
    "openproject.refresh",
    refreshWPs,
  );
  vscode.window.createTreeView("openproject-workspaces", {
    treeDataProvider: OpenProjectTreeDataProvider.getInstance(),
  });
  context.subscriptions.push(authCommand, refreshWPsCommand);
}

export function deactivate() {}
