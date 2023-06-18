jest.mock("../../../core/filter/project/project.filter");
jest.mock("../../../core/filter/status/status.wpsFilter");
jest.mock("../../../core/filter/text/text.wpsFilter");
jest.mock("../../../infrastructure/project/project.repository");
jest.mock("../../../infrastructure/status/status.repository");
jest.mock("../../quickPicks/project/project.quickPick");
jest.mock("../../quickPicks/wpStatus/wpStatus.quickPick");

import { faker } from "@faker-js/faker";
import { Project, Status } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import * as vscode from "../../../__mocks__/vscode";
import ProjectsFilter from "../../../core/filter/project/project.filter.interface";
import StatusWPsFilter from "../../../core/filter/status/status.wpsFilter.interface";
import TextWPsFilter from "../../../core/filter/text/text.wpsFilter.interface";
import ProjectRepository from "../../../infrastructure/project/project.repository.interface";
import StatusRepository from "../../../infrastructure/status/status.repository.interface";
import ProjectQuickPick from "../../quickPicks/project/project.quickPick";
import WPStatusQuickPick from "../../quickPicks/wpStatus/wpStatus.quickPick";
import SetupFiltersCommandImpl from "./setupFilters.command";

describe("filter WPs command test suite", () => {
  let command: SetupFiltersCommandImpl;
  const textFilter = container.get<TextWPsFilter>(TOKENS.textFilter);
  const statusFilter = container.get<StatusWPsFilter>(TOKENS.statusFilter);
  const projectFilter = container.get<ProjectsFilter>(TOKENS.projectFilter);
  const projectRepo = container.get<ProjectRepository>(
    TOKENS.projectRepository,
  );
  const statusRepo = container.get<StatusRepository>(TOKENS.statusRepository);

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
    const projects = faker.helpers.uniqueArray(
      () => new Project(faker.number.int()),
      10,
    );
    const projectIds = projects.map((p) => p.id);

    it("should show quickpick", async () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue([]);
      jest.spyOn(ProjectQuickPick.prototype, "show").mockResolvedValue([]);
      await command.setupProjectFilter();
      expect(ProjectQuickPick.prototype.show).toHaveBeenCalled();
    });
    it("should setProjectFilter results", async () => {
      jest
        .spyOn(ProjectQuickPick.prototype, "show")
        .mockResolvedValue(projectIds);
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      jest.spyOn(projectFilter, "setProjectFilter");

      await command.setupProjectFilter();

      expect(projectFilter.setProjectFilter).toHaveBeenLastCalledWith(
        projectIds,
      );
    });
    it("should setProjectFilter filter if got undefined", async () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue([]);
      jest.spyOn(projectFilter, "getProjectFilter").mockReturnValue(projectIds);
      jest
        .spyOn(ProjectQuickPick.prototype, "show")
        .mockResolvedValue(undefined);
      jest.spyOn(projectFilter, "setProjectFilter");

      await command.setupProjectFilter();

      expect(projectFilter.setProjectFilter).toHaveBeenLastCalledWith(
        projectIds,
      );
    });
    it("should setProjectFilter projectIds if got undefined and filter is undefined", async () => {
      jest.spyOn(projectRepo, "findAll").mockReturnValue(projects);
      jest.spyOn(projectFilter, "getProjectFilter").mockReturnValue(undefined);
      jest
        .spyOn(ProjectQuickPick.prototype, "show")
        .mockResolvedValue(undefined);
      jest.spyOn(projectFilter, "setProjectFilter");

      await command.setupProjectFilter();

      expect(projectFilter.setProjectFilter).toHaveBeenLastCalledWith(
        projectIds,
      );
    });
  });
  describe("setupStatusFilter", () => {
    const statuses = faker.helpers.uniqueArray(faker.number.int, 5);

    it("should show quickpick", async () => {
      jest.spyOn(statusRepo, "findAll").mockReturnValue([]);
      jest.spyOn(WPStatusQuickPick.prototype, "show").mockResolvedValue([]);
      await command.setupStatusFilter();
      expect(WPStatusQuickPick.prototype.show).toHaveBeenCalled();
    });
    it("should setStatusFilter results", async () => {
      jest.spyOn(statusRepo, "findAll").mockReturnValue([]);
      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(statuses);
      jest.spyOn(statusFilter, "setStatusFilter");

      await command.setupStatusFilter();

      expect(statusFilter.setStatusFilter).toHaveBeenLastCalledWith(statuses);
    });
    it("should setStatusFilter filter if got undefined", async () => {
      jest.spyOn(statusRepo, "findAll").mockReturnValue([]);
      jest.spyOn(statusFilter, "getStatusFilter").mockReturnValue(statuses);
      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(undefined);
      jest.spyOn(statusFilter, "setStatusFilter");

      await command.setupStatusFilter();

      expect(statusFilter.setStatusFilter).toHaveBeenLastCalledWith(statuses);
    });
    it("should setStatusFilter statuses if got undefined and filter is undefined", async () => {
      jest
        .spyOn(statusRepo, "findAll")
        .mockReturnValue(statuses.map((id) => new Status(id)));
      jest.spyOn(statusFilter, "getStatusFilter").mockReturnValue(undefined);
      jest
        .spyOn(WPStatusQuickPick.prototype, "show")
        .mockResolvedValue(undefined);
      jest.spyOn(statusFilter, "setStatusFilter");

      await command.setupStatusFilter();

      expect(statusFilter.setStatusFilter).toHaveBeenLastCalledWith(statuses);
    });
  });
});
