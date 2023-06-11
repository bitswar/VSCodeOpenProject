jest.mock("../../../infrastructure/openProject/openProject.client");
jest.mock("../../views/openProject.treeDataProvider");

import { faker } from "@faker-js/faker";
import { User } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import * as vscode from "../../../__mocks__/vscode";
import OpenProjectClient from "../../../infrastructure/openProject/openProject.client";
import VSCodeConfigMock from "../../../test/config.mock";
import OpenProjectTreeDataProvider from "../../views/openProject.treeDataProvider";
import AuthorizeClientCommandImpl from "./authorizeClient.command";

describe("Authorize client command test suite", () => {
  let command: AuthorizeClientCommandImpl;
  let client: OpenProjectClient;
  let treeDataProvider: OpenProjectTreeDataProvider;
  let config: VSCodeConfigMock;
  const user = new User(1);

  beforeEach(() => {
    jest.clearAllMocks();
    command = container.get(TOKENS.authorizeCommand);
    client = container.get(TOKENS.opClient);
    treeDataProvider = container.get(TOKENS.opTreeView);
    config = new VSCodeConfigMock({
      base_url: faker.internet.url(),
      token: faker.string.sample(),
    });
    jest.spyOn(vscode.workspace, "getConfiguration").mockReturnValue(config);
    jest.spyOn(client, "init").mockResolvedValue(user);

    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
  });

  describe("Init call", () => {
    it("should call init with correct data", async () => {
      await command.authorizeClient();
      expect(client.init).toHaveBeenLastCalledWith(
        config.get("base_url"),
        config.get("token"),
      );
    });
    it("should call init empty string", async () => {
      const emptyConfig = new VSCodeConfigMock({});
      jest
        .spyOn(vscode.workspace, "getConfiguration")
        .mockReturnValue(emptyConfig);

      await command.authorizeClient();

      expect(client.init).toHaveBeenLastCalledWith("", "");
    });
  });

  describe("On success", () => {
    it("should set 'openproject.authed' to true on success", async () => {
      jest.spyOn(vscode.commands, "executeCommand");

      await command.authorizeClient();

      expect(vscode.commands.executeCommand).toHaveBeenLastCalledWith(
        "setContext",
        "openproject.authed",
        true,
      );
    });

    it("should show message 'Hello' on success", async () => {
      jest.spyOn(vscode.window, "showInformationMessage");

      await command.authorizeClient();

      expect(vscode.window.showInformationMessage).toHaveBeenLastCalledWith(
        `Hello, ${user.firstName} ${user.lastName}!`,
      );
    });

    it("should call 'refresh WPs' on treeDataProvider", async () => {
      await command.authorizeClient();

      expect(treeDataProvider.refreshWPs).toHaveBeenCalled();
    });
  });
  describe("On fail", () => {
    it("should show error message", async () => {
      jest.spyOn(vscode.window, "showErrorMessage");
      jest.spyOn(client, "init").mockResolvedValue(undefined);

      await command.authorizeClient();

      expect(vscode.window.showErrorMessage).toHaveBeenLastCalledWith(
        "Failed connecting to OpenProject",
      );
    });

    it("should call nothing else", async () => {
      jest.spyOn(client, "init").mockResolvedValue(undefined);
      jest.spyOn(vscode.commands, "executeCommand");
      jest.spyOn(vscode.window, "showInformationMessage");

      await command.authorizeClient();

      expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
    });
  });
});
