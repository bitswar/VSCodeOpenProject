import { faker } from "@faker-js/faker";
import { Project } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import ProjectsFilterImpl from "./project.filter";

describe("WPs project filter test suite", () => {
  let filter: ProjectsFilterImpl;

  beforeAll(() => {
    filter = container.get<ProjectsFilterImpl>(TOKENS.projectFilter);
  });

  describe("Filter", () => {
    const p1 = { id: 1 };
    const p2 = { id: 2 };
    const p3 = { id: 3 };
    const projects = [p1, p2, p3] as Project[];

    it("should return all projects if projectFilter is undefined", () => {
      const result = filter.filter(projects);
      expect(result).toEqual(projects);
    });
    it("should return all projects if projectFilter contains all ids", () => {
      filter.setProjectFilter([1, 2, 3]);
      const result = filter.filter(projects);
      expect(result).toEqual(projects);
    });
    it("should return projects from project 1", () => {
      filter.setProjectFilter([1]);
      const result = filter.filter(projects);
      expect(result).toEqual([p1]);
    });
    it("should return projects from projects 1 and 2", () => {
      filter.setProjectFilter([1, 2]);
      const result = filter.filter(projects);
      expect(result).toEqual(expect.arrayContaining([p1, p2]));
    });
    it("should return empty array", () => {
      filter.setProjectFilter([4]);
      const result = filter.filter(projects);
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
