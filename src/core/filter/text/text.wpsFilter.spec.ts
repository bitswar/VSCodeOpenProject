import { faker } from "@faker-js/faker";
import { WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import TextWPsFilterImpl from "./text.wpsFilter";

describe("WPs text filter test suite", () => {
  let filter: TextWPsFilterImpl;

  beforeAll(() => {
    filter = container.get<TextWPsFilterImpl>(TOKENS.textFilter);
  });

  describe("Filter", () => {
    const helloWorldWP = {
      subject: "Hello world!",
      author: {
        name: "goodhumored",
        firstName: "Kirill",
        lastName: "Nekrasov",
        login: "goodhumored",
      },
      body: {
        description: {
          raw: "Lorem ipsum dolor amet...",
        },
      },
    } as WP;
    const easterEggWP = {
      subject: "Lorem ipsum!",
      author: {
        name: "goodhumored",
        firstName: "Kirill",
        lastName: "Nekrasov",
        login: "goodhumored",
      },
      body: {
        description: {
          raw: "Easter egg!",
        },
      },
    } as WP;
    const dannyWP = {
      subject: "Title",
      author: {
        name: "dannyweiss",
        firstName: "Danila",
        lastName: "Smolyakov",
        login: "dannyweiss",
      },
      body: {
        description: {
          raw: "Lorem ipsum",
        },
      },
    } as WP;
    const bugWP = {
      subject: "Bug!",
      author: {
        name: "Svante Kaiser",
        firstName: "Sviat",
        lastName: "Tsarev",
        login: "svante_kaiser",
      },
      body: {},
    } as WP;

    const wps: WP[] = [helloWorldWP, easterEggWP, dannyWP, bugWP];

    it("should return all wps if filter is not set", () => {
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return all wps", () => {
      filter.setTextFilter("");
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return wps with hello world", () => {
      filter.setTextFilter("Hello world!");
      const result = filter.filter(wps);
      expect(result).toEqual([helloWorldWP]);
    });
    it("should return wps by goodhumored", () => {
      filter.setTextFilter("goodhumored");
      const result = filter.filter(wps);
      expect(result).toEqual([helloWorldWP, easterEggWP]);
    });
    it("should return lorem ipsum wps", () => {
      filter.setTextFilter("lorem ipsum");
      const result = filter.filter(wps);
      expect(result).toEqual(
        expect.arrayContaining([helloWorldWP, dannyWP, easterEggWP]),
      );
    });
    it("should return empty array", () => {
      filter.setTextFilter("aaaaaaaaaaaaaaaaaa");
      const result = filter.filter(wps);
      expect(result).toEqual([]);
    });
  });

  describe("SetNameFilter", () => {
    it("should set name filter", () => {
      const nameFilter = faker.string.alpha();
      filter.setTextFilter(nameFilter);
      expect(filter.getTextFilter()).toEqual(nameFilter);
    });
    it("should emit filter updated event", () => {
      const nameFilter = faker.string.alpha();
      filter.setTextFilter(nameFilter);
      expect(filter["_onFilterUpdated"].fire).toHaveBeenCalled();
    });
  });

  describe("onFilterUpdated", () => {
    it("should bind listener", () => {
      const func = jest.fn();
      filter.onFilterUpdated(func);
      expect(filter["_onFilterUpdated"].event).toHaveBeenLastCalledWith(func);
    });
  });
});
