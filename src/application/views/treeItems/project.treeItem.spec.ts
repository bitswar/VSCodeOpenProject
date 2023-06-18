import { faker } from "@faker-js/faker";
import { Project } from "op-client";
import { TreeItemCollapsibleState } from "../../../__mocks__/vscode";
import ProjectTreeItem from "./project.treeItem";

describe("Project tree item test suit", () => {
  describe("should construct correctly", () => {
    it("should return a tree item with label, collapsible state and icon path", () => {
      const text = faker.lorem.text();
      const project: Project = {
        id: 1,
        body: {
          name: "Test Project",
          description: {
            raw: text,
          },
        },
      } as Project;
      const treeItem = new ProjectTreeItem(project as any);
      expect(treeItem.label).toEqual("Test Project");
      expect(treeItem.description).toEqual(text);
      expect(treeItem.collapsibleState).toEqual(
        TreeItemCollapsibleState.Expanded,
      );
    });
    it("should return a tree item with an empty description", () => {
      const project: Project = {
        id: 1,
        body: {
          name: "Test Project",
        },
      } as Project;
      const treeItem = new ProjectTreeItem(project as any);
      expect(treeItem.label).toEqual("Test Project");
      expect(treeItem.description).toBeUndefined();
      expect(treeItem.collapsibleState).toEqual(
        TreeItemCollapsibleState.Expanded,
      );
    });
  });
});
