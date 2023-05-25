// jest.mock("../__mocks__/vscode", () => vscode);
jest.mock("../openProject.client");
jest.mock("../views/openProject.treeDataProvider");
const vscode = require("../__mocks__/vscode");

import { faker } from "@faker-js/faker";
import { User } from "op-client";
import OpenProjectClient from "../openProject.client";
import VSCodeConfigMock from "../test/config.mock";
import OpenProjectTreeDataProvider from "../views/openProject.treeDataProvider";
import authorizeClient from "./authorizeClient.command";

describe("Authorize client command test suit", () => {
  const client = new OpenProjectClient();
  const config = new VSCodeConfigMock({
    base_url: faker.internet.url(),
    token: faker.string.sample(),
  });
  const user = new User(1);
  const treeDataProvider = { refreshWPs: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(OpenProjectClient, "getInstance").mockReturnValue(client);
    jest.spyOn(vscode.workspace, "getConfiguration").mockReturnValue(config);
    jest.spyOn(client, "init").mockResolvedValue(user);

    jest
      .spyOn(OpenProjectTreeDataProvider, "getInstance")
      .mockReturnValue(treeDataProvider as any);

    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
  });

  describe("Init call", () => {
    it("should call init with correct data", async () => {
      await authorizeClient();
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

      await authorizeClient();

      expect(client.init).toHaveBeenLastCalledWith("", "");
    });
  });

  describe("On success", () => {
    it("should set 'openproject.authed' to true on success", async () => {
      jest.spyOn(vscode.commands, "executeCommand");

      await authorizeClient();

      expect(vscode.commands.executeCommand).toHaveBeenLastCalledWith(
        "setContext",
        "openproject.authed",
        true,
      );
    });

    it("should show message 'Hello' on success", async () => {
      jest.spyOn(vscode.window, "showInformationMessage");

      await authorizeClient();

      expect(vscode.window.showInformationMessage).toHaveBeenLastCalledWith(
        `Hello, ${user.firstName} ${user.lastName}!`,
      );
    });

    it("should call 'refresh WPs' on treeDataProvider", async () => {
      await authorizeClient();

      expect(treeDataProvider.refreshWPs).toHaveBeenCalled();
    });
  });
  describe("On fail", () => {
    it("should show error message", async () => {
      jest.spyOn(vscode.window, "showErrorMessage");
      jest.spyOn(client, "init").mockResolvedValue(undefined);

      await authorizeClient();

      expect(vscode.window.showErrorMessage).toHaveBeenLastCalledWith(
        "Failed connecting to OpenProject",
      );
    });

    it("should call nothing else", async () => {
      jest.spyOn(client, "init").mockResolvedValue(undefined);
      jest.spyOn(OpenProjectTreeDataProvider, "getInstance");
      jest.spyOn(vscode.commands, "executeCommand");
      jest.spyOn(vscode.window, "showInformationMessage");

      await authorizeClient();

      expect(OpenProjectTreeDataProvider.getInstance).not.toHaveBeenCalled();
      expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
    });
  });
});
