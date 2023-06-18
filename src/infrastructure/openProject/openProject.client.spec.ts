jest.mock("../logger/logger");

import { faker } from "@faker-js/faker";
import { Project, Status, User, WP } from "op-client";
import "reflect-metadata";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import ConsoleLogger from "../logger/logger";
import ClientNotInitializedException from "./clientNotInitialized.exception";
import OpenProjectClientImpl from "./openProject.client";
import UnexceptedClientException from "./unexpectedClientError.exception";
import UserNotFound from "./userNotFound.exception";

jest.mock("op-client");

describe("OpenProject Client tests", () => {
  let client: OpenProjectClientImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    client = container.get<OpenProjectClientImpl>(TOKENS.opClient);

    client["_entityManager"] = {
      fetch: jest.fn(),
      get: jest.fn(),
      getMany: jest.fn(),
      patch: jest.fn(),
    } as any;
  });

  describe("Initialization", () => {
    it("should be initialized correctly", () => {
      const token = faker.string.alphanumeric();
      const baseUrl = faker.internet.url();

      expect(client.init(baseUrl, token)).toBeUndefined();
    });
    it("should fire event", () => {
      const token = faker.string.alphanumeric();
      const baseUrl = faker.internet.url();
      jest.spyOn(client["_onInit"], "fire");

      client.init(baseUrl, token);

      expect(client["_onInit"].fire).toHaveBeenCalled();
    });
    it("should pass correct logger factory function", () => {
      const token = faker.string.alphanumeric();
      const baseUrl = faker.internet.url();

      client.init(baseUrl, token);

      expect(
        (
          client["_entityManager"]!.constructor as jest.Mock
        ).mock.calls[0][0].createLogger(),
      ).toBeInstanceOf(ConsoleLogger);
    });
  });

  describe("GetUser", () => {
    it("should call entity manager's fetch", async () => {
      jest.spyOn(client["_entityManager"]!, "fetch").mockResolvedValueOnce(1);

      await client.getUser();

      expect(client["_entityManager"]!.fetch).toHaveBeenCalledWith(
        "api/v3/users/me",
      );
    });
    it("should return user", async () => {
      const user = new User(1);

      jest
        .spyOn(client["_entityManager"]!, "fetch")
        .mockResolvedValueOnce(user);

      expect(await client.getUser()).toEqual(user);
    });
    it("should throw ClientNotInitializedException if entity manager is null", () => {
      client["_entityManager"] = undefined;

      expect(() => client.getUser()).toThrowError(
        ClientNotInitializedException,
      );
    });
    it("should throw UserNotFound if no user found", async () => {
      jest
        .spyOn(client["_entityManager"]!, "fetch")
        .mockResolvedValueOnce(null);

      await expect(client.getUser()).rejects.toThrowError(UserNotFound);
    });
    it("should throw UnexceptedClientException if error returned", async () => {
      jest
        .spyOn(client["_entityManager"]!, "fetch")
        .mockRejectedValueOnce(null);

      await expect(client.getUser()).rejects.toThrowError(
        UnexceptedClientException,
      );
    });
  });

  describe("getWPs", () => {
    it("should call getMany", async () => {
      jest
        .spyOn(client["_entityManager"]!, "getMany")
        .mockResolvedValueOnce([]);

      await client.getWPs();

      expect(client["_entityManager"]!.getMany).toHaveBeenLastCalledWith(WP, {
        pageSize: 100,
        all: true,
        filters: [],
      });
    });
    it("should return wps", async () => {
      const wps = faker.helpers.uniqueArray(() => new WP(1), 5);

      jest
        .spyOn(client["_entityManager"]!, "getMany")
        .mockResolvedValueOnce(wps);

      expect(await client.getWPs()).toEqual(wps);
    });
    it("should throw ClientNotInitializedException if entity manager is null", () => {
      client["_entityManager"] = undefined;

      expect(() => client.getWPs()).toThrowError(ClientNotInitializedException);
    });
  });

  describe("getProjects", () => {
    it("should call getMany", async () => {
      jest.spyOn(client["_entityManager"]!, "getMany");

      await client.getProjects();

      expect(client["_entityManager"]!.getMany).toHaveBeenLastCalledWith(
        Project,
        {
          pageSize: 100,
          all: true,
          filters: [],
        },
      );
    });
    it("should return projects", async () => {
      const projects = faker.helpers.uniqueArray(
        () => new Project(faker.number.int()),
        5,
      );

      jest
        .spyOn(client["_entityManager"]!, "getMany")
        .mockResolvedValueOnce(projects);

      expect(await client.getProjects()).toEqual(projects);
    });
  });

  describe("addTokenToUrl", () => {
    it("should return correct url", () => {
      const token = faker.string.alphanumeric(10);
      const url = "http://google.com";

      const result = `http://apikey:${token}@google.com/`;

      expect(client["addTokenToUrl"](url, token)).toBe(result);
    });
  });

  describe("Save", () => {
    it("should call entityManager.patch", async () => {
      const wp = new WP(1);
      jest.spyOn(client["_entityManager"]!, "patch");

      await client.save(wp);

      expect(client["_entityManager"]?.patch).toHaveBeenCalledWith(wp);
    });
  });

  describe("GetStatuses", () => {
    it("should return statuses from entityManager getMany", async () => {
      const statuses = faker.helpers.uniqueArray(
        () => new Status(faker.number.int()),
        5,
      );

      jest
        .spyOn(client["_entityManager"]!, "getMany")
        .mockResolvedValueOnce(statuses);

      expect(await client.getStatuses()).toEqual(statuses);
    });
  });
});
