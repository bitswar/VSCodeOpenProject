import { faker } from "@faker-js/faker";
import addCredsToUrl from "./addCredsToUrl.util";

describe("addTokenToUrl", () => {
  it("should return correct url", () => {
    const username = faker.string.alphanumeric(10);
    const password = faker.string.alphanumeric(10);
    const url = "http://google.com";

    const result = `http://${username}:${password}@google.com/`;

    expect(addCredsToUrl(url, username, password)).toBe(result);
  });
});
