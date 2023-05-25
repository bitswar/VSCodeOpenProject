import { TreeItemCollapsibleState } from "vscode";
import OpenProjectTreeDataProvider from "./openProject.treeDataProvider";

describe("OpenProjectTreeDataProvider", () => {
  let instance: OpenProjectTreeDataProvider;

  beforeEach(() => {
    instance = OpenProjectTreeDataProvider.getInstance();
    jest.spyOn(instance["_client"], "getWPs").mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("refreshWPs", () => {
    it("should update the workPackages array with new work packages", async () => {
      instance["_onDidChangeTreeData"] = { fire: jest.fn() } as any;
      jest.spyOn(instance["_client"], "getWPs").mockResolvedValue([
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

      await instance.refreshWPs();

      expect(instance["workPackages"]).toEqual([
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
      ]);
    });
    it("should fire _onDidChangeTreeData", async () => {
      instance["_onDidChangeTreeData"] = { fire: jest.fn() } as any;
      jest.spyOn(instance["_client"], "getWPs").mockResolvedValue([
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

      await instance.refreshWPs();

      expect(instance["_onDidChangeTreeData"].fire).toHaveBeenCalled();
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
      const treeItem = await instance.getTreeItem(wp as any);
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
      const treeItem = await instance.getTreeItem(wp as any);
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
      const treeItem = await instance.getTreeItem(wp as any);
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
      const treeItem = await instance.getTreeItem(wp as any);
      expect(treeItem.label).toEqual("#1 Test Work Package");
      expect(treeItem.collapsibleState).toEqual(
        TreeItemCollapsibleState.Collapsed,
      );
      expect(treeItem.iconPath).not.toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("should return the top-level work packages", () => {
      instance["workPackages"] = [
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
      const topLevelWPs = instance.getChildren();
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
      instance["workPackages"] = [parentWP, ...parentWP.children] as any;

      expect(instance.getChildren(parentWP as any)).toEqual([
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
      expect(instance.resolveTreeItem(item)).toEqual(item);
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
      instance["workPackages"] = [ancestorWP, ...ancestorWP.children] as any;
      const parentWP = instance.getParent({
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
