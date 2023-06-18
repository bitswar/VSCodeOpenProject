/* eslint-disable no-new */
jest.mock("../../../infrastructure/openProject/openProject.client");

import { faker } from "@faker-js/faker";
import { User } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import * as vscode from "../../../__mocks__/vscode";
import ConsoleLogger from "../../../infrastructure/logger/logger";
import OpenProjectClient from "../../../infrastructure/openProject/openProject.client";
import UserNotFound from "../../../infrastructure/openProject/userNotFound.exception";
import VSCodeConfigMock from "../../../test/config.mock";
import AuthorizeClientCommandImpl from "./authorizeClient.command";

describe("Authorize client command test suite", () => {
  let command: AuthorizeClientCommandImpl;
  let client: OpenProjectClient;

  beforeEach(() => {
    jest.clearAllMocks();
    command = container.get(TOKENS.authorizeCommand);
    client = container.get(TOKENS.opClient);
  });

  describe("Constructor", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should showMessage on client onInit", () => {
      const spy = jest.spyOn(client, "onInit");

      const newCommand = new AuthorizeClientCommandImpl(
        client,
        new ConsoleLogger(),
      );

      expect(spy.mock.calls).toEqual(
        expect.arrayContaining([[newCommand.showMessage, newCommand]]),
      );
    });
    it("should setAuthedTrue on client onInit", () => {
      const spy = jest.spyOn(client, "onInit");

      const newCommand = new AuthorizeClientCommandImpl(
        client,
        new ConsoleLogger(),
      );

      expect(spy.mock.calls).toEqual(
        expect.arrayContaining([[newCommand.setAuthedTrue, newCommand]]),
      );
    });
  });

  describe("authorizeClient", () => {
    it("should call init with correct data", () => {
      const config = new VSCodeConfigMock({
        base_url: faker.internet.url(),
        token: faker.string.sample(),
      });
      jest.spyOn(vscode.workspace, "getConfiguration").mockReturnValue(config);
      jest.spyOn(client, "init");

      command.authorizeClient();

      expect(client.init).toHaveBeenLastCalledWith(
        config.get("base_url"),
        config.get("token"),
      );
    });
    it("should call init empty string", () => {
      const emptyConfig = new VSCodeConfigMock({});
      jest
        .spyOn(vscode.workspace, "getConfiguration")
        .mockReturnValue(emptyConfig);

      command.authorizeClient();

      expect(client.init).toHaveBeenLastCalledWith("", "");
    });
  });

  describe("showMessage", () => {
    it("should show message 'Hello' on success", async () => {
      const user = new User(1);
      user.name = `${faker.person.firstName()} ${faker.person.lastName()}`;

      jest.spyOn(vscode.window, "showInformationMessage");
      jest.spyOn(client, "getUser").mockResolvedValue(user);

      await command.showMessage();

      expect(vscode.window.showInformationMessage).toHaveBeenLastCalledWith(
        `Hello, ${user.name}!`,
      );
    });
    it("should show error message", async () => {
      jest.spyOn(vscode.window, "showErrorMessage");
      jest.spyOn(client, "getUser").mockRejectedValue(new UserNotFound());
      await command.showMessage();

      expect(vscode.window.showErrorMessage).toHaveBeenLastCalledWith(
        "Failed connecting to OpenProject",
      );
    });
  });

  describe("setAuthedTrue", () => {
    it("should set 'openproject.authed' to true", () => {
      jest.spyOn(vscode.commands, "executeCommand");

      command.setAuthedTrue();

      expect(vscode.commands.executeCommand).toHaveBeenLastCalledWith(
        "setContext",
        "openproject.authed",
        true,
      );
    });
  });
});
