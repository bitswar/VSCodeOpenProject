import { Project } from "op-client";
import ProjectQuickPickItem from "./project.quickPickItem";
import { faker } from "@faker-js/faker";

describe("projectId quick pick item test suite", () => {
  it("should have project's name as label", () => {
    const project = new Project(1);
    project.body.name = "dipal";

    const item = new ProjectQuickPickItem(project);

    expect(item.label).toEqual("dipal");
  });
  it("should have default name as label if project has no name", () => {
    const project = new Project(1);
    project.body.name = undefined;

    const item = new ProjectQuickPickItem(project);

    expect(item.label).toEqual("Project #1");
  });
  it("should have project's id as payload", () => {
    const project = new Project(1);

    const item = new ProjectQuickPickItem(project);

    expect(item.projectId).toEqual(1);
  });
  it("should have project's description as description", () => {
    const project = new Project(1);
    project.body.description = { raw: faker.lorem.text() } as any;

    const item = new ProjectQuickPickItem(project);

    expect(item.description).toEqual(project.body.description?.raw);
  });
  it("should have undefined description if project has no description", () => {
    const project = new Project(1);

    const item = new ProjectQuickPickItem(project);

    expect(item.description).toBeUndefined();
  });
  it("should have undefined description if project has no description", () => {
    const project = new Project(1);

    const item = new ProjectQuickPickItem(project);

    expect(item.description).toBeUndefined();
  });
  it("should have picked = true", () => {
    const project = new Project(1);
    const picked = true;

    const item = new ProjectQuickPickItem(project, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false", () => {
    const project = new Project(1);
    const picked = false;

    const item = new ProjectQuickPickItem(project, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false if no picked passed", () => {
    const project = new Project(1);

    const item = new ProjectQuickPickItem(project);

    expect(item.picked).toEqual(false);
  });
});
