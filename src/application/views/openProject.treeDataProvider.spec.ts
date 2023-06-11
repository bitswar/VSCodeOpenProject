jest.mock("../../infrastructure/project/project.repository");
jest.mock("../../infrastructure/workPackage/wp.repository");

import { faker } from "@faker-js/faker";
import { Project, WP } from "op-client";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import ProjectRepository from "../../infrastructure/project/project.repository.interface";
import WPRepository from "../../infrastructure/workPackage/wp.repository.interface";
import OpenProjectTreeDataProviderImpl from "./openProject.treeDataProvider";

describe("OpenProjectTreeDataProvider", () => {
  const treeView = container.get<OpenProjectTreeDataProviderImpl>(
    TOKENS.opTreeView,
  );
  const wpRepo = container.get<WPRepository>(TOKENS.wpRepository);
  const projectRepo = container.get<ProjectRepository>(
    TOKENS.projectRepository,
  );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTreeItem", () => {
    it.todo("should return wp tree item");
    it.todo("should return project tree item");
  });

  describe("getChildren", () => {
    it("should return the project", () => {
      const projects = faker.helpers.uniqueArray(
        () => new Project(faker.number.int()),
        10,
      );

      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);

      const result = treeView.getChildren();
      expect(result).toEqual(projects);
    });
    it("should return wps of project", () => {
      const wps = faker.helpers.uniqueArray(
        () => new WP(faker.number.int()),
        10,
      );

      jest.spyOn(wpRepo, "findByProjectId").mockReturnValue(wps);

      const result = treeView.getChildren(new Project(1));
      expect(result).toEqual(wps);
    });

    it("should return the children of a work package", () => {
      const wps = faker.helpers.uniqueArray(
        () => new WP(faker.number.int()),
        10,
      );

      jest.spyOn(wpRepo, "findByParentId").mockReturnValue(wps);

      const result = treeView.getChildren(new WP(1));
      expect(result).toEqual(wps);
    });
  });

  describe("resolveTreeItem", () => {
    it("should return item", () => {
      const item = {};
      expect(treeView.resolveTreeItem(item)).toEqual(item);
    });
  });

  describe("getParent", () => {
    it("should return project", () => {
      const wp = new WP(1);
      const project = new Project(1);
      wp.project = project;

      jest.spyOn(projectRepo, "findById").mockReturnValue(project);

      expect(treeView.getParent(wp)).toEqual(project);
    });
    it("should return workPackage", () => {
      const wp = new WP(1);
      const wp1 = new WP(2);
      wp1.parent = wp;

      jest.spyOn(wpRepo, "findById").mockReturnValue(wp);

      expect(treeView.getParent(wp1)).toEqual(wp);
    });
    it("should return undefined", () => {
      const project = new Project(1);

      expect(treeView.getParent(project)).toBeUndefined();
    });
  });

  describe("refresh", () => {
    it("should call wpRepo refetch", () => {
      jest.spyOn(wpRepo, "refetch");
      treeView.refresh();
      expect(wpRepo.refetch).toHaveBeenCalled();
    });
    it("should call projectRepo refetch", () => {
      jest.spyOn(projectRepo, "refetch");
      treeView.refresh();
      expect(projectRepo.refetch).toHaveBeenCalled();
    });
  });
});
