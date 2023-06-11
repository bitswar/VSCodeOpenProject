jest.mock("./application/commands/authorize/authorizeClient.command");
jest.mock("./application/commands/refresh/refreshWPs.command");
jest.mock("./application/views/openProject.treeDataProvider");

const vscode = require("./__mocks__/vscode");

import container from "./DI/container";
import TOKENS from "./DI/tokens";
import AuthorizeClientCommand from "./application/commands/authorize/authorizeClientCommand.interface";
import RefreshWPsCommand from "./application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProvider from "./application/views/openProjectTreeDataProvider.interface";
import { activate, deactivate } from "./extension";

describe("activate", () => {
  let context: any;

  let authCommand: AuthorizeClientCommand;
  let refreshCommand: RefreshWPsCommand;
  let treeView: OpenProjectTreeDataProvider;

  beforeAll(() => {
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
          ["openproject.auth", authCommand.authorizeClient],
        ]),
      );
    });
    it("registers refresh command", () => {
      activate(context);
      expect(vscode.commands.registerCommand.mock.calls).toEqual(
        expect.arrayContaining([
          ["openproject.refresh", refreshCommand.refreshWPs],
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
    it("adds 3 subscriptions to context", () => {
      activate(context);
      expect(context.subscriptions).toHaveLength(3);
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
});

describe("deactivate", () => {
  it("nothing should happen", () => {
    deactivate();
  });
});
