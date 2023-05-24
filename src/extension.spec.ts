const vscode = require("./__mocks__/vscode");

jest.mock("./views/openProject.treeDataProvider");
jest.mock("./commands/authorizeClient.command");
jest.mock("./commands/refreshWPs.command");

import OpenProjectTreeDataProvider from "./views/openProject.treeDataProvider";
import authorizeClient from "./commands/authorizeClient.command";
import refreshWPs from "./commands/refreshWPs.command";
import { activate, deactivate } from "./extension";

describe("activate", () => {
  let context: any;

  beforeEach(() => {
    context = {
      subscriptions: [],
    };
  });

  test("registers expected commands", () => {
    activate(context);
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      "openproject.auth",
      authorizeClient,
    );
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      "openproject.refresh",
      refreshWPs,
    );
  });

  test("creates expected tree view", () => {
    activate(context);
    expect(vscode.window.createTreeView).toHaveBeenCalledWith(
      "openproject-workspaces",
      expect.any(Object),
    );
    expect(OpenProjectTreeDataProvider.getInstance).toHaveBeenCalled();
  });

  test("adds commands and subscriptions to context", () => {
    activate(context);
    expect(context.subscriptions).toHaveLength(2);
  });
});

describe("deactivate", () => {
  it("nothing should happen", () => {
    deactivate();
  });
});
