import { faker } from "@faker-js/faker";
import { User, WP } from "op-client";
import OpenProjectClient, {
  addTokenToUrl,
  createLogger,
} from "./openProject.client";

jest.mock("op-client");

describe("OpenProject Client tests", () => {
  let client: OpenProjectClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = OpenProjectClient.getInstance();
    client["entityManager"] = {
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
      jest.spyOn(client["entityManager"]!, "fetch").mockResolvedValueOnce(1);

      await client.getUser();

      expect(client["entityManager"]!.fetch).toHaveBeenCalledWith(
        "api/v3/users/me",
      );
    });
    it("should return user", async () => {
      const user = new User(1);

      jest.spyOn(client["entityManager"]!, "fetch").mockResolvedValueOnce(user);

      expect(await client.getUser()).toEqual(user);
    });
    it("should return undefined if entity manager is null", async () => {
      client["entityManager"] = undefined;

      expect(await client.getUser()).toBeUndefined();
    });
    it("should return undefined if error returned", async () => {
      jest.spyOn(client["entityManager"]!, "fetch").mockRejectedValueOnce(null);

      expect(await client.getUser()).toBeUndefined();
    });
  });

  describe("getWPs", () => {
    it("should call getMany", async () => {
      jest.spyOn(client["entityManager"]!, "getMany").mockResolvedValueOnce([]);

      await client.getWPs();

      expect(client["entityManager"]!.getMany).toHaveBeenLastCalledWith(WP, {
        pageSize: 100,
        all: true,
        filters: [],
      });
    });
    it("should return wps", async () => {
      const wps = faker.helpers.uniqueArray(() => new WP(1), 5);

      jest
        .spyOn(client["entityManager"]!, "getMany")
        .mockResolvedValueOnce(wps);

      expect(await client.getWPs()).toEqual(wps);
    });
    it("should return undefined if entity manager is null", async () => {
      client["entityManager"] = undefined;

      expect(await client.getWPs()).toBeUndefined();
    });
  });
});

describe("addTokenToUrl", () => {
  it("should return correct url", () => {
    const token = faker.string.alphanumeric(10);
    const url = "http://google.com";

    const result = `http://apikey:${token}@google.com/`;

    expect(addTokenToUrl(url, token)).toBe(result);
  });
});

describe("createLogger", () => {
  it("should return console", () => {
    expect(createLogger()).toEqual(console);
  });
});
