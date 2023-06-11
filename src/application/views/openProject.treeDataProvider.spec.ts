jest.mock("../../infrastructure/openProject/openProject.client");
import { WP } from "op-client";
import { TreeItemCollapsibleState } from "vscode";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../../infrastructure/openProject/openProjectClient.interface";
import OpenProjectTreeDataProviderImpl from "./openProject.treeDataProvider";

describe("OpenProjectTreeDataProvider", () => {
  let treeView: OpenProjectTreeDataProviderImpl;
  let client: OpenProjectClient;

  beforeAll(() => {
    client = container.get(TOKENS.opClient);
    jest.spyOn(client, "getWPs").mockResolvedValue([]);
    treeView = container.get(TOKENS.opTreeView);
  });

  beforeEach(() => {
    jest.spyOn(client, "getWPs").mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("refreshWPs", () => {
    it("should update the workPackages array with new work packages", async () => {
      const wps: WP[] = [
        {
          id: 1,
          subject: "Test Work Package",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        },
      ] as any;
      jest.spyOn(client, "getWPs").mockResolvedValue(wps);

      await treeView.refreshWPs();

      expect(treeView["workPackages"]).toEqual(wps);
    });
    it("should fire _onDidChangeTreeData", async () => {
      jest.spyOn(client, "getWPs").mockResolvedValue([
        {
          id: 1,
          subject: "Test Work Package",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        } as any,
      ]);

      await treeView.refreshWPs();

      expect(treeView["_onDidChangeTreeData"].fire).toHaveBeenCalled();
    });
  });

  describe("getTreeItem", () => {
    it("should return a tree item with label, collapsible state and icon path", async () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [],
        parent: null,
        ancestor: null,
      };
      const treeItem = await treeView.getTreeItem(wp as any);
      expect(treeItem.label).toEqual("#1 Test Work Package");
      expect(treeItem.collapsibleState).toEqual(TreeItemCollapsibleState.None);
      expect(treeItem.iconPath).toBeUndefined();
    });
    it("should return a tree item with label, collapsible state and icon path", async () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: null,
        parent: null,
        ancestor: null,
      };
      const treeItem = await treeView.getTreeItem(wp as any);
      expect(treeItem.label).toEqual("#1 Test Work Package");
      expect(treeItem.collapsibleState).toEqual(TreeItemCollapsibleState.None);
      expect(treeItem.iconPath).toBeUndefined();
    });
    it("should return a tree item with label, collapsible state = collapsed and icon path", async () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [{}],
        parent: null,
        ancestor: null,
      };
      const treeItem = await treeView.getTreeItem(wp as any);
      expect(treeItem.label).toEqual("#1 Test Work Package");
      expect(treeItem.collapsibleState).toEqual(
        TreeItemCollapsibleState.Collapsed,
      );
      expect(treeItem.iconPath).toBeUndefined();
    });
    it("should return a tree item with label, collapsible state and some icon path", async () => {
      const wp = {
        id: 1,
        subject: "Test Work Package",
        status: {
          self: {
            title: "In progress",
          },
        },
        children: [{}],
        parent: null,
        ancestor: null,
      };
      const treeItem = await treeView.getTreeItem(wp as any);
      expect(treeItem.label).toEqual("#1 Test Work Package");
      expect(treeItem.collapsibleState).toEqual(
        TreeItemCollapsibleState.Collapsed,
      );
      expect(treeItem.iconPath).not.toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("should return the top-level work packages", () => {
      treeView["workPackages"] = [
        {
          id: 1,
          subject: "Test Work Package 1",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        },
        {
          id: 2,
          subject: "Test Work Package 2",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        },
      ] as any;
      const topLevelWPs = treeView.getChildren();
      expect(topLevelWPs).toEqual([
        {
          id: 1,
          subject: "Test Work Package 1",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        },
        {
          id: 2,
          subject: "Test Work Package 2",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: null,
          ancestor: null,
        },
      ]);
    });

    it("should return the children of a work package", () => {
      const parentWP = {
        id: 1,
        subject: "Parent Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [
          {
            id: 2,
            subject: "Child Work Package",
            status: {
              self: {
                title: "New",
              },
            },
            children: [],
            parent: {
              id: 1,
              subject: "Parent Work Package",
            },
            ancestor: null,
          },
        ],
        parent: null,
        ancestor: null,
      };
      treeView["workPackages"] = [parentWP, ...parentWP.children] as any;

      expect(treeView.getChildren(parentWP as any)).toEqual([
        {
          id: 2,
          subject: "Child Work Package",
          status: {
            self: {
              title: "New",
            },
          },
          children: [],
          parent: {
            id: 1,
            subject: "Parent Work Package",
          },
          ancestor: null,
        },
      ]);
    });
  });

  describe("resolveTreeItem", () => {
    it("should return item", () => {
      const item = {};
      expect(treeView.resolveTreeItem(item)).toEqual(item);
    });
  });

  describe("getParent", () => {
    it("should return the ancestor of a work package", () => {
      const ancestorWP = {
        id: 1,
        subject: "Ancestor Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [
          {
            id: 2,
            subject: "Parent Work Package",
            status: {
              self: {
                title: "New",
              },
            },
            children: [
              {
                id: 3,
                subject: "Child Work Package",
                status: {
                  self: {
                    title: "New",
                  },
                },
                children: [],
                parent: {
                  id: 2,
                  subject: "Parent Work Package",
                },
                ancestor: {
                  id: 1,
                  subject: "Ancestor Work Package",
                },
              },
            ],
            parent: null,
            ancestor: {
              id: 1,
              subject: "Ancestor Work Package",
            },
          },
        ],
        parent: null,
        ancestor: null,
      };
      treeView["workPackages"] = [ancestorWP, ...ancestorWP.children] as any;
      const parentWP = treeView.getParent({
        id: 3,
        subject: "Child Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [],
        parent: {
          id: 2,
          subject: "Parent Work Package",
        },
        ancestor: {
          id: 1,
          subject: "Ancestor Work Package",
        },
      } as any);
      expect(parentWP).toEqual({
        id: 2,
        subject: "Parent Work Package",
        status: {
          self: {
            title: "New",
          },
        },
        children: [
          {
            id: 3,
            subject: "Child Work Package",
            status: {
              self: {
                title: "New",
              },
            },
            children: [],
            parent: {
              id: 2,
              subject: "Parent Work Package",
            },
            ancestor: {
              id: 1,
              subject: "Ancestor Work Package",
            },
          },
        ],
        parent: null,
        ancestor: {
          id: 1,
          subject: "Ancestor Work Package",
        },
      });
    });
  });
});
