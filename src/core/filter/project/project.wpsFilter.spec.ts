import { faker } from "@faker-js/faker";
import { WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import ProjectWPsFilterImpl from "./project.wpsFilter";

describe("WPs project filter test suite", () => {
  let filter: ProjectWPsFilterImpl;

  beforeAll(() => {
    filter = container.get<ProjectWPsFilterImpl>(TOKENS.projectFilter);
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
      project: {
        id: 1,
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
      project: {
        id: 2,
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
      project: {
        id: 2,
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
      body: {
        description: {
          raw: faker.lorem.text(),
        },
      },
      project: {
        id: 0,
      },
    } as WP;

    const wps: WP[] = [helloWorldWP, easterEggWP, dannyWP, bugWP];

    it("should return all wps if projectFilter is undefined", () => {
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return all wps if projectFilter contains all ids", () => {
      filter.setProjectFilter([0, 1, 2]);
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return wps from project 1", () => {
      filter.setProjectFilter([1]);
      const result = filter.filter(wps);
      expect(result).toEqual([helloWorldWP]);
    });
    it("should return wps from project 2", () => {
      filter.setProjectFilter([2]);
      const result = filter.filter(wps);
      expect(result).toEqual([easterEggWP, dannyWP]);
    });
    it("should return wps from projects 1 and 2", () => {
      filter.setProjectFilter([1, 2]);
      const result = filter.filter(wps);
      expect(result).toEqual(
        expect.arrayContaining([helloWorldWP, dannyWP, easterEggWP]),
      );
    });
    it("should return empty array", () => {
      filter.setProjectFilter([3]);
      const result = filter.filter(wps);
      expect(result).toEqual([]);
    });
  });

  describe("setProjectFilter", () => {
    it("should set project filter", () => {
      const projectIds = faker.helpers.uniqueArray(faker.number.int, 5);
      filter.setProjectFilter(projectIds);
      expect(filter.getProjectFilter()).toEqual(projectIds);
    });
    it("should emit filter updated event", () => {
      const projectIds = faker.helpers.uniqueArray(faker.number.int, 5);
      filter.setProjectFilter(projectIds);
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
