import * as vscode from "vscode";
import container from "./DI/container";
import TOKENS from "./DI/tokens";
import AuthorizeClientCommand from "./application/commands/authorize/authorizeClientCommand.interface";
import SetupFiltersCommand from "./application/commands/filter/setupFilters.command.interface";
import RefreshWPsCommand from "./application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProvider from "./application/views/openProject.treeDataProvider";
import CompositeWPsFilter from "./core/filter/composite/composite.wpsFilter.interface";
import WPsFilter from "./core/filter/wpsFilter.interface";

export function activate(context: vscode.ExtensionContext) {
  composeFilters();

  const authCommand = container.get<AuthorizeClientCommand>(
    TOKENS.authorizeCommand,
  );
  const refreshCommand = container.get<RefreshWPsCommand>(
    TOKENS.refreshWPsCommand,
  );
  const setupFilterCommand = container.get<SetupFiltersCommand>(
    TOKENS.setupFiltersCommand,
  );
  const treeView = container.get<OpenProjectTreeDataProvider>(
    TOKENS.opTreeView,
  );

  const components = [
    vscode.commands.registerCommand(
      "openproject.auth",
      authCommand.authorizeClient,
      authCommand,
    ),
    vscode.commands.registerCommand(
      "openproject.refresh",
      refreshCommand.refreshWPs,
      refreshCommand,
    ),
    vscode.commands.registerCommand(
      "openproject.setupFilter",
      setupFilterCommand.setupFilters,
      setupFilterCommand,
    ),
    vscode.window.createTreeView("openproject-workspaces", {
      treeDataProvider: treeView,
    }),
  ];

  context.subscriptions.push(...components);

  authCommand.authorizeClient();
}

function composeFilters() {
  const compositeFilter = container.get<CompositeWPsFilter>(
    TOKENS.compositeFilter,
  );
  const textFilter = container.get<WPsFilter>(TOKENS.textFilter);
  const projectFilter = container.get<WPsFilter>(TOKENS.projectFilter);
  const statusFilter = container.get<WPsFilter>(TOKENS.statusFilter);
  compositeFilter.pushFilter(textFilter);
  compositeFilter.pushFilter(projectFilter);
  compositeFilter.pushFilter(statusFilter);
}

export function deactivate() {}
