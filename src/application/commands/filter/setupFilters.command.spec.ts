jest.mock("../../../core/filter/project/project.wpsFilter");
jest.mock("../../../core/filter/status/status.wpsFilter");
jest.mock("../../../core/filter/text/text.wpsFilter");
jest.mock("../../../infrastructure/project/project.repository");

import { faker } from "@faker-js/faker";
import { Project } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import * as vscode from "../../../__mocks__/vscode";
import ProjectWPsFilter from "../../../core/filter/project/project.wpsFilter.interface";
import StatusWPsFilter from "../../../core/filter/status/status.wpsFilter.interface";
import TextWPsFilter from "../../../core/filter/text/text.wpsFilter.interface";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import ProjectRepository from "../../../infrastructure/project/project.repository.interface";
import SetupFiltersCommandImpl, { PayloadItem } from "./setupFilters.command";

describe("filter WPs command test suite", () => {
  let command: SetupFiltersCommandImpl;
  const textFilter = container.get<TextWPsFilter>(TOKENS.textFilter);
  const statusFilter = container.get<StatusWPsFilter>(TOKENS.statusFilter);
  const projectFilter = container.get<ProjectWPsFilter>(TOKENS.projectFilter);
  const projectRepo = container.get<ProjectRepository>(
    TOKENS.projectRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    command = container.get<SetupFiltersCommandImpl>(
      TOKENS.setupFiltersCommand,
    );
  });

  describe("Setup filters", () => {
    it("should call vscode prompt and ask for filter", () => {
      jest.spyOn(vscode.window, "showQuickPick");

      command.setupFilters();

      expect(vscode.window.showQuickPick).toHaveBeenCalled();
    });
    it("should call setupFunction of item", async () => {
      const setupFunc = jest.fn();
      jest
        .spyOn(vscode.window, "showQuickPick")
        .mockResolvedValue({ payload: setupFunc } as any);

      await command.setupFilters();

      expect(setupFunc).toHaveBeenCalled();
    });
    it("should call nothing if item wasnt choosen", async () => {
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      await command.setupFilters();
    });
  });
  describe("Setup text filter", () => {
    it("should show input box", async () => {
      jest.spyOn(vscode.window, "showInputBox");
      await command.setupTextFilter();
      expect(vscode.window.showInputBox).toHaveBeenCalled();
    });
    it("should value from getTextFilter", async () => {
      const query = faker.string.alpha();

      jest.spyOn(textFilter, "getTextFilter").mockReturnValue(query);
      jest.spyOn(vscode.window, "showInputBox");

      await command.setupTextFilter();

      expect(vscode.window.showInputBox).toHaveBeenLastCalledWith(
        expect.objectContaining({ value: query }),
      );
    });
    it("should setTextFilter", async () => {
      const query = faker.string.alpha();

      jest.spyOn(vscode.window, "showInputBox").mockResolvedValue(query);
      jest.spyOn(textFilter, "setTextFilter");

      await command.setupTextFilter();

      expect(textFilter.setTextFilter).toHaveBeenLastCalledWith(query);
    });
  });
  describe("setupProjectFilter", () => {
    it("should show quickpick", async () => {
      jest.spyOn(vscode.window, "showQuickPick");
      jest.spyOn(command, "getProjectIdQuickPickItems").mockReturnValue([]);
      await command.setupProjectFilter();
      expect(vscode.window.showQuickPick).toHaveBeenCalled();
    });
    it("should get quickpick items from getProjectFilterItems function", async () => {
      const items: any[] = [];

      jest.spyOn(command, "getProjectIdQuickPickItems").mockReturnValue(items);

      await command.setupProjectFilter();

      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        items,
        expect.anything(),
      );
    });
    it("should setProjectFilter results", async () => {
      const projectIds = faker.helpers.uniqueArray(faker.number.int, 5);
      const results = projectIds.map((num) => ({ projectId: num }));

      jest.spyOn(command, "getProjectIdQuickPickItems").mockReturnValue([]);
      jest
        .spyOn(vscode.window, "showQuickPick")
        .mockResolvedValue(results as any);
      jest.spyOn(projectFilter, "setProjectFilter");

      await command.setupProjectFilter();

      expect(projectFilter.setProjectFilter).toHaveBeenLastCalledWith(
        projectIds,
      );
    });
    it("should setProjectFilter empty array", async () => {
      jest.spyOn(command, "getProjectIdQuickPickItems").mockReturnValue([]);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      jest.spyOn(projectFilter, "setProjectFilter");

      await command.setupProjectFilter();

      expect(projectFilter.setProjectFilter).toHaveBeenLastCalledWith([]);
    });
  });
  describe("setupStatusFilter", () => {
    it("should show quickpick", async () => {
      jest.spyOn(vscode.window, "showQuickPick");
      await command.setupStatusFilter();
      expect(vscode.window.showQuickPick).toHaveBeenCalled();
    });
    it("should get quickpick items from getStatusFilterItems function", async () => {
      const items: any[] = [];

      jest.spyOn(command, "getStatusQuickPickItems").mockReturnValue(items);

      await command.setupStatusFilter();

      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        items,
        expect.anything(),
      );
    });
    it("should setStatusFilter results", async () => {
      const statuses = faker.helpers.uniqueArray(faker.string.alpha, 5);
      const results = statuses.map((num) => ({ status: num }));

      jest.spyOn(command, "getStatusQuickPickItems").mockReturnValue([]);
      jest
        .spyOn(vscode.window, "showQuickPick")
        .mockResolvedValue(results as any);
      jest.spyOn(statusFilter, "setStatusFilter");

      await command.setupStatusFilter();

      expect(statusFilter.setStatusFilter).toHaveBeenLastCalledWith(statuses);
    });
    it("should setStatusFilter empty array", async () => {
      jest.spyOn(command, "getStatusQuickPickItems").mockReturnValue([]);
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      jest.spyOn(statusFilter, "setStatusFilter");

      await command.setupStatusFilter();

      expect(statusFilter.setStatusFilter).toHaveBeenLastCalledWith([]);
    });
  });

  describe("getProjectIdQuickPickItems", () => {
    beforeAll(() => {
      (command.getProjectIdQuickPickItems as jest.Mock).mockRestore();
    });
    const projects: Project[] = [
      {
        body: { name: "project1" },
        id: 1,
      },
      {
        body: { name: "project2" },
        id: 2,
      },
      {
        body: { name: "project3" },
        id: 3,
      },
    ] as Project[];

    it("should return empty array if there are no projects", () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue([]);
      expect(command.getProjectIdQuickPickItems()).toEqual([]);
    });
    it("should return array with the same length", () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      const items = command.getProjectIdQuickPickItems();
      expect(items).toHaveLength(projects.length);
    });
    it("should return array of items with project ids and project names", () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      const items = command.getProjectIdQuickPickItems();
      items.forEach((item, index) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            projectId: projects[index].id,
            label: projects[index].body.name,
          }),
        );
      });
    });
    it("should return array of items with project ids and project names", () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      const items = command.getProjectIdQuickPickItems();
      items.forEach((item, index) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            projectId: projects[index].id,
            label: projects[index].body.name,
          }),
        );
      });
    });
    it("should mark projects from getProjectFilter as picked", () => {
      const filter = [projects[0].id, projects[1].id];
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      jest.spyOn(projectFilter, "getProjectFilter").mockReturnValue(filter);
      const items = command.getProjectIdQuickPickItems();
      items.forEach((item, index) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            picked: filter.includes(projects[index].id),
          }),
        );
      });
    });
    it("should mark all projects as picked if getProjectFilter returned undefined", () => {
      const filter = undefined;
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      jest.spyOn(projectFilter, "getProjectFilter").mockReturnValue(filter);
      const items = command.getProjectIdQuickPickItems();
      items.forEach((item) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            picked: true,
          }),
        );
      });
    });
  });
  describe("getStatusQuickPickItems", () => {
    beforeAll(() => {
      (command.getStatusQuickPickItems as jest.Mock).mockRestore();
    });
    it("should return array of items for all WPStatuses", () => {
      const items = command.getStatusQuickPickItems();
      expect(items).toHaveLength(Object.keys(WPStatus).length);
    });
    it("should return array of items with status names", () => {
      const items = command.getStatusQuickPickItems();
      items.forEach((item, index) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            status: Object.values(WPStatus)[index],
            label: Object.values(WPStatus)[index],
          }),
        );
      });
    });
    it("should mark items from getStatusFilter as picked", () => {
      const filter = [WPStatus.closed, WPStatus.inSpecification];
      jest.spyOn(statusFilter, "getStatusFilter").mockReturnValue(filter);
      const items = command.getStatusQuickPickItems();
      items.forEach((item, index) => {
        expect(item).toEqual(
          expect.objectContaining<Partial<typeof item>>({
            picked: filter.includes(Object.values(WPStatus)[index]),
          }),
        );
      });
    });
  });
});
