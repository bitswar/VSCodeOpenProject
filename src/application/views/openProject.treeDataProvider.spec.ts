/* eslint-disable no-new */
jest.mock("../../infrastructure/project/project.repository");
jest.mock("../../infrastructure/workPackage/wp.repository");

import { faker } from "@faker-js/faker";
import { Project, WP } from "op-client";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import Filter from "../../core/filter/filter.interface";
import OpenProjectClient from "../../infrastructure/openProject/openProject.client.interface";
import ProjectRepository from "../../infrastructure/project/project.repository.interface";
import WPRepository from "../../infrastructure/workPackage/wp.repository.interface";
import OpenProjectTreeDataProviderImpl from "./openProject.treeDataProvider";
import ProjectTreeItem from "./treeItems/project.treeItem";
import WPTreeItem from "./treeItems/wp.treeItem";

describe("OpenProjectTreeDataProvider", () => {
  const treeView = container.get<OpenProjectTreeDataProviderImpl>(
    TOKENS.opTreeView,
  );
  const wpRepo = container.get<WPRepository>(TOKENS.wpRepository);
  const projectRepo = container.get<ProjectRepository>(
    TOKENS.projectRepository,
  );
  const client = container.get<OpenProjectClient>(TOKENS.opClient);
  const wpFilter = container.get<Filter<WP>>(TOKENS.compositeFilter);
  const projectFilter = container.get<Filter<Project>>(TOKENS.projectFilter);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("should subscribe to wpRepo onWPsChange", () => {
      jest.spyOn(wpRepo, "onWPsChange");

      new OpenProjectTreeDataProviderImpl(
        wpRepo,
        projectRepo,
        client,
        wpFilter,
        projectFilter,
      );

      expect(wpRepo.onWPsChange).toHaveBeenCalled();
    });
    it("should subscribe to projectRepo onProjectsRefetch", () => {
      jest.spyOn(projectRepo, "onProjectsChange");

      new OpenProjectTreeDataProviderImpl(
        wpRepo,
        projectRepo,
        client,
        wpFilter,
        projectFilter,
      );

      expect(projectRepo.onProjectsChange).toHaveBeenCalled();
    });
    it("should subscribe to client onInit", () => {
      jest.spyOn(client, "onInit");
      new OpenProjectTreeDataProviderImpl(
        wpRepo,
        projectRepo,
        client,
        wpFilter,
        projectFilter,
      );
      expect(client.onInit).toHaveBeenCalled();
    });
    it("should subscribe to wpFilter onFilterUpdated", () => {
      jest.spyOn(wpFilter, "onFilterUpdated");
      new OpenProjectTreeDataProviderImpl(
        wpRepo,
        projectRepo,
        client,
        wpFilter,
        projectFilter,
      );
      expect(wpFilter.onFilterUpdated).toHaveBeenCalled();
    });
    it("should subscribe to projectFilter onFilterUpdated", () => {
      jest.spyOn(projectFilter, "onFilterUpdated");
      new OpenProjectTreeDataProviderImpl(
        wpRepo,
        projectRepo,
        client,
        wpFilter,
        projectFilter,
      );
      expect(projectFilter.onFilterUpdated).toHaveBeenCalled();
    });
  });

  describe("getTreeItem", () => {
    it("should return wp tree item", () => {
      const wp = new WP(1);
      const treeItem = treeView.getTreeItem(wp);
      expect(treeItem).toBeInstanceOf(WPTreeItem);
    });
    it("should return project tree item", () => {
      const project = new Project(1);
      const treeItem = treeView.getTreeItem(project);
      expect(treeItem).toBeInstanceOf(ProjectTreeItem);
    });
    it("should return empty object", () => {
      const project = {};
      const treeItem = treeView.getTreeItem(project as any);
      expect(treeItem).toBeInstanceOf(Object);
    });
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
  describe("redraw", () => {
    it("should fire onDataChangeEvent", () => {
      jest.spyOn(treeView["_onDidChangeTreeData"], "fire");
      treeView.redraw();
      expect(treeView["_onDidChangeTreeData"].fire).toHaveBeenCalled();
    });
  });
});
