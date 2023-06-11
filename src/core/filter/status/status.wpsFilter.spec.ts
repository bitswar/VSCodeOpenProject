import { faker } from "@faker-js/faker";
import { WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import StatusWPsFilterImpl from "./status.wpsFilter";

describe("WPs status filter test suite", () => {
  let filter: StatusWPsFilterImpl;

  beforeAll(() => {
    filter = container.get<StatusWPsFilterImpl>(TOKENS.statusFilter);
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
      status: {
        self: {
          title: WPStatus.closed,
        },
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
      status: {
        self: {
          title: WPStatus.new,
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
      project: {
        id: 2,
      },
      status: {
        self: {
          title: WPStatus.new,
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
      body: {
        description: {
          raw: faker.lorem.text(),
        },
      },
      project: {
        id: 0,
      },
      status: {
        self: {
          title: WPStatus.developed,
        },
      },
    } as WP;

    const wps: WP[] = [helloWorldWP, easterEggWP, dannyWP, bugWP];

    it("should return all wps if projectFilter is undefined", () => {
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return all wps if projectFilter contains all ids", () => {
      filter.setStatusFilter(Object.values(WPStatus));
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return wps with status closed", () => {
      filter.setStatusFilter([WPStatus.closed]);
      const result = filter.filter(wps);
      expect(result).toEqual([helloWorldWP]);
    });
    it("should return wps with status new", () => {
      filter.setStatusFilter([WPStatus.new]);
      const result = filter.filter(wps);
      expect(result).toEqual([easterEggWP, dannyWP]);
    });
    it("should return wps with statuses new and closed", () => {
      filter.setStatusFilter([WPStatus.new, WPStatus.closed]);
      const result = filter.filter(wps);
      expect(result).toEqual(
        expect.arrayContaining([helloWorldWP, dannyWP, easterEggWP]),
      );
    });
    it("should return empty array", () => {
      filter.setStatusFilter([WPStatus.onHold]);
      const result = filter.filter(wps);
      expect(result).toEqual([]);
    });
  });

  describe("setProjectFilter", () => {
    it("should set project filter", () => {
      const projectIds = faker.helpers.uniqueArray(
        faker.string.alpha,
        5,
      ) as WPStatus[];
      filter.setStatusFilter(projectIds);
      expect(filter.getStatusFilter()).toEqual(projectIds);
    });
    it("should emit filter updated event", () => {
      const projectIds = faker.helpers.uniqueArray(
        faker.string.alpha,
        5,
      ) as WPStatus[];
      filter.setStatusFilter(projectIds);
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
