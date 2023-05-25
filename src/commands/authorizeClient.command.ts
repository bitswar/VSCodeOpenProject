import OpenProjectClient from "../openProject.client";
import * as vscode from "vscode";
import OpenProjectTreeDataProvider from "../views/openProject.treeDataProvider";

export default async function authorizeClient() {
  const config = vscode.workspace.getConfiguration("openproject");
  const client = OpenProjectClient.getInstance();
  const user = await client.init(
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
  OpenProjectTreeDataProvider.getInstance().refreshWPs();
}
