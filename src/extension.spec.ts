jest.mock("./application/commands/authorize/authorizeClient.command");
jest.mock("./application/commands/refresh/refreshWPs.command");
jest.mock("./application/views/openProject.treeDataProvider");

const vscode = require("./__mocks__/vscode");

import container from "./DI/container";
import TOKENS from "./DI/tokens";
import AuthorizeClientCommand from "./application/commands/authorize/authorizeClientCommand.interface";
import SetupFiltersCommand from "./application/commands/filter/setupFilters.command.interface";
import RefreshWPsCommand from "./application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProvider from "./application/views/openProjectTreeDataProvider.interface";
import CompositeWPsFilter from "./core/filter/composite/composite.wpsFilter.interface";
import { activate, deactivate } from "./extension";

describe("activate", () => {
  let context: any;

  let authCommand: AuthorizeClientCommand;
  let refreshCommand: RefreshWPsCommand;
  let setupFiltersCommand: SetupFiltersCommand;
  let treeView: OpenProjectTreeDataProvider;

  beforeAll(() => {
    setupFiltersCommand = container.get<SetupFiltersCommand>(
      TOKENS.setupFiltersCommand,
    );
    authCommand = container.get<AuthorizeClientCommand>(
      TOKENS.authorizeCommand,
    );
    refreshCommand = container.get<RefreshWPsCommand>(TOKENS.refreshWPsCommand);
    treeView = container.get<OpenProjectTreeDataProvider>(TOKENS.opTreeView);
  });

  beforeEach(() => {
    context = {
      subscriptions: [],
    };
  });

  describe("registers all commands", () => {
    it("registers auth command", () => {
      activate(context);
      expect(vscode.commands.registerCommand.mock.calls).toEqual(
        expect.arrayContaining([
          ["openproject.auth", authCommand.authorizeClient, authCommand],
        ]),
      );
    });
    it("registers refresh command", () => {
      activate(context);
      expect(vscode.commands.registerCommand.mock.calls).toEqual(
        expect.arrayContaining([
          ["openproject.refresh", refreshCommand.refreshWPs, refreshCommand],
        ]),
      );
    });
    it("registers setup filter command", () => {
      activate(context);
      expect(vscode.commands.registerCommand.mock.calls).toEqual(
        expect.arrayContaining([
          [
            "openproject.setupFilter",
            setupFiltersCommand.setupFilters,
            setupFiltersCommand,
          ],
        ]),
      );
    });
  });

  it("creates expected tree view", () => {
    activate(context);
    expect(vscode.window.createTreeView).toHaveBeenCalledWith(
      "openproject-workspaces",
      { treeDataProvider: treeView },
    );
  });

  describe("subscriptions", () => {
    it("adds 4 subscriptions to context", () => {
      activate(context);
      expect(context.subscriptions).toHaveLength(4);
    });
    it("adds authCommand to subscriptions to context", () => {
      jest
        .spyOn(vscode.commands, "registerCommand")
        .mockImplementation((name) => name);
      activate(context);
      expect(context.subscriptions).toEqual(
        expect.arrayContaining(["openproject.auth"]),
      );
    });
    it("adds refreshCommand to subscriptions to context", () => {
      jest
        .spyOn(vscode.commands, "registerCommand")
        .mockImplementation((name) => name);
      activate(context);
      expect(context.subscriptions).toEqual(
        expect.arrayContaining(["openproject.refresh"]),
      );
    });
    it("adds treeView to subscriptions to context", () => {
      jest
        .spyOn(vscode.window, "createTreeView")
        .mockImplementation((name) => name);
      activate(context);
      expect(context.subscriptions).toEqual(
        expect.arrayContaining(["openproject-workspaces"]),
      );
    });
  });

  describe("setupFilters", () => {
    it("should push all filters", () => {
      const compositeFilter = container.get<CompositeWPsFilter>(
        TOKENS.compositeFilter,
      );
      jest.spyOn(compositeFilter, "pushFilter");

      activate(context);

      expect(compositeFilter.pushFilter).toHaveBeenCalled();
    });
  });
});

describe("deactivate", () => {
  it("nothing should happen", () => {
    deactivate();
  });
});
