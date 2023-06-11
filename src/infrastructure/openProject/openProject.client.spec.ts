jest.mock("../logger/logger");

import { faker } from "@faker-js/faker";
import { User, WP } from "op-client";
import "reflect-metadata";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import ClientNotInitializedException from "./clientNotInitialized.exception";
import UnexceptedClientException from "./unexpectedClientError.exception";
import UserNotFound from "./userNotFound.exception";
import OpenProjectClientImpl from "./openProject.client";
import Logger from "../logger/logger.interface";

jest.mock("op-client");

describe("OpenProject Client tests", () => {
  let client: OpenProjectClientImpl;
  let logger: Logger;

  beforeEach(() => {
    jest.clearAllMocks();
    client = container.get<OpenProjectClientImpl>(TOKENS.opClient);
    logger = container.get<Logger>(TOKENS.logger);

    client["_entityManager"] = {
      fetch: jest.fn(),
      get: jest.fn(),
      getMany: jest.fn(),
    } as any;
  });

  describe("Initialization", () => {
    it("should be initialized correctly", async () => {
      const token = faker.string.alphanumeric();
      const baseUrl = faker.internet.url();
      const user = new User(1);

      jest.spyOn(client, "getUser").mockResolvedValueOnce(user);

      expect(await client.init(baseUrl, token)).toEqual(user);
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

  describe("addTokenToUrl", () => {
    it("should return correct url", () => {
      const token = faker.string.alphanumeric(10);
      const url = "http://google.com";

      const result = `http://apikey:${token}@google.com/`;

      expect(client["addTokenToUrl"](url, token)).toBe(result);
    });
  });
  describe("getLogger", () => {
    it("should return logger", () => {
      expect(client["getLogger"]()).toEqual(logger);
    });
  });
});
