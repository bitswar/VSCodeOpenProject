import { faker } from "@faker-js/faker";
import { Project } from "op-client";
import * as vscode from "vscode";
import ProjectQuickPick from "./project.quickPick";

describe("ProjectQuickPick test suite", () => {
  describe("constructor", () => {
    it("should construct quick pick without errors", () => {
      const pids = faker.helpers.uniqueArray(
        () => new Project(faker.number.int()),
        5,
      );
      const title = faker.string.alpha();
      const multi = faker.datatype.boolean();

      const qp = new ProjectQuickPick(title, pids, multi);

      expect(qp).toBeInstanceOf(ProjectQuickPick);
    });
  });

  describe("setPickedItems", () => {
    const projects = [1, 2, 3].map((id) => new Project(id));

    it("should set change nothing if empty array passed", () => {
      const qp = new ProjectQuickPick("title", projects, true);
      const itemsCopy = JSON.parse(JSON.stringify(qp["_items"]));

      qp.setPickedProjects([]);

      expect(qp["_items"]).toEqual(itemsCopy);
    });
    it("should set change something if non-empty array passed", () => {
      const qp = new ProjectQuickPick("title", projects, true);
      const itemsCopy = JSON.parse(JSON.stringify(Object.assign(qp["_items"])));

      qp.setPickedProjects([1]);

      expect(qp["_items"]).not.toEqual(itemsCopy);
    });
    it("should mark items with passed pids as picked", () => {
      const qp = new ProjectQuickPick("title", projects, true);

      qp.setPickedProjects([1]);

      expect(qp["_items"][0].picked).toBeTruthy();
    });
  });

  describe("show", () => {
    const pids = [1, 2, 3];
    const projects = pids.map((id) => new Project(id));

    it("should call showQuickPick", async () => {
      const qp = new ProjectQuickPick("title", projects, true);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      await qp.show();
      expect(vscode.window.showQuickPick).toHaveBeenCalled();
    });

    it("should call showQuickPick with items", async () => {
      const qp = new ProjectQuickPick("title", projects, true);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      await qp.show();
      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        qp["_items"],
        expect.anything(),
      );
    });

    it("should call showQuickPick with multiSelect", async () => {
      const qp = new ProjectQuickPick("title", projects, true);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      await qp.show();
      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ canPickMany: true }),
      );
    });

    it("should call showQuickPick with title", async () => {
      const qp = new ProjectQuickPick("title", projects, true);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      await qp.show();
      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ title: "title" }),
      );
    });

    it("should return picked projectIds", async () => {
      const qp = new ProjectQuickPick("title", projects, true);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(
        pids.map((pid) => ({
          projectId: pid,
        })) as any,
      );
      const projectIds = await qp.show();
      expect(projectIds).toEqual(pids);
    });
  });
});
