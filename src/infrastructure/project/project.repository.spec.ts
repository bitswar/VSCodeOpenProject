jest.mock("../openProject/openProject.client");

import { Project } from "op-client";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../openProject/openProject.client.interface";
import ProjectRepository from "./project.repository.interface";
import ProjectNotFoundException from "./projectNotFount.exception";

describe("Project repository test suite", () => {
  const client = container.get<OpenProjectClient>(TOKENS.opClient);
  const repository = container.get<ProjectRepository>(TOKENS.projectRepository);
  const project1 = new Project(1);
  const project2 = new Project(2);
  const project3 = new Project(3);
  const project4 = new Project(4);
  const project5 = new Project(5);

  beforeAll(async () => {
    jest
      .spyOn(client, "getProjects")
      .mockResolvedValue([project1, project2, project3, project4]);
    await repository.refetch();
  });

  describe("findById", () => {
    it("should return project1", () => {
      expect(repository.findById(project1.id)).toEqual(project1);
    });
    it("should return project2 by id", () => {
      expect(repository.findById(project2.id)).toEqual(project2);
    });
    it("should return project3 by id", () => {
      expect(repository.findById(project3.id)).toEqual(project3);
    });
    it("should return project4 by id", () => {
      expect(repository.findById(project4.id)).toEqual(project4);
    });
    it("should throw ProjectNotFoundException", () => {
      expect(() => repository.findById(project5.id)).toThrowError(
        ProjectNotFoundException,
      );
    });
  });

  describe("findAll", () => {
    it("should return all projects", () => {
      expect(repository.findAll()).toEqual([
        project1,
        project2,
        project3,
        project4,
      ]);
    });
  });

  describe("refetch", () => {
    it("should call client getProjects again", () => {
      repository.refetch();
      expect(client.getProjects).toHaveBeenCalled();
    });
  });
});
