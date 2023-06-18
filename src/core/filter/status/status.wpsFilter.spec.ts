import { faker } from "@faker-js/faker";
import { Project, Status, WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
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
      status: new Status(1),
      body: {
        description: {
          raw: "Lorem ipsum dolor amet...",
        },
      },
      project: new Project(1),
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
      project: new Project(1),
      status: new Status(2),
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
      project: new Project(2),
      status: new Status(2),
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
      project: new Project(0),
      status: new Status(3),
    } as WP;

    const wps: WP[] = [helloWorldWP, easterEggWP, dannyWP, bugWP];

    it("should return all wps if statusFilter is undefined", () => {
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return all wps if statusFilter contains all ids", () => {
      filter.setStatusFilter([new Status(1), new Status(2), new Status(3)]);
      const result = filter.filter(wps);
      expect(result).toEqual(wps);
    });
    it("should return wps with status 1", () => {
      filter.setStatusFilter([new Status(1)]);
      const result = filter.filter(wps);
      expect(result).toEqual([helloWorldWP]);
    });
    it("should return wps with status 2", () => {
      filter.setStatusFilter([new Status(2)]);
      const result = filter.filter(wps);
      expect(result).toEqual([easterEggWP, dannyWP]);
    });
    it("should return wps with statuses 1 and 2", () => {
      filter.setStatusFilter([new Status(1), new Status(2)]);
      const result = filter.filter(wps);
      expect(result).toEqual(
        expect.arrayContaining([helloWorldWP, dannyWP, easterEggWP]),
      );
    });
    it("should return empty array", () => {
      filter.setStatusFilter([new Status(4)]);
      const result = filter.filter(wps);
      expect(result).toEqual([]);
    });
  });

  describe("setStatusFilter", () => {
    it("should set status filter", () => {
      const statusIds = faker.helpers.uniqueArray(faker.number.int, 5);
      filter.setStatusFilter(statusIds);
      expect(filter.getStatusFilter()).toEqual(statusIds);
    });
    it("should emit filter updated event", () => {
      const statusIds = faker.helpers.uniqueArray(faker.number.int, 5);
      filter.setStatusFilter(statusIds);
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
