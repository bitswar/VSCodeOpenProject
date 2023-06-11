import { TreeItemCollapsibleState } from "../../../__mocks__/vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPTreeItem from "./wp.treeItem";

describe("WP tree item test suit", () => {
  describe("should construct correctly", () => {
    describe("simple new task", () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        type: {
          self: {
            title: "Task",
          },
        },
        children: [],
      };
      it("should return a tree item with label", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.label).toEqual({
          label: "#1 Test Work Package Task",
          highlights: [
            [0, 2],
            [21, 25],
          ],
        });
      });
      it("should return a tree item with collapsible state", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.collapsibleState).toEqual(
          TreeItemCollapsibleState.None,
        );
      });
      it("should return a tree item with undefined icon path", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.iconPath).toBeUndefined();
      });
    });
    describe("phase with children", () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: WPStatus.closed,
          },
        },
        type: {
          self: {
            title: "Phase",
          },
        },
        children: [{}],
      };
      it("should return tree item with collapsible state collapsed", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.collapsibleState).toEqual(
          TreeItemCollapsibleState.Collapsed,
        );
      });
      it("should return a tree item with some icon path", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.iconPath).not.toBeUndefined();
      });
    });
    describe("undefined type", () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: WPStatus.closed,
          },
        },
      };
      it("should return a tree item with label", () => {
        const treeItem = new WPTreeItem(wp as any);
        expect(treeItem.label).toEqual({
          label: "#1 Test Work Package",
          highlights: [
            [0, 2],
            [20, 20],
          ],
        });
      });
    });
  });
});
