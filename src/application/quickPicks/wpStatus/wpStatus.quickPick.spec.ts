/* eslint-disable no-new */
import { faker } from "@faker-js/faker";
import * as vscode from "vscode";
import WPStatusQuickPick from "./wpStatus.quickPick";

describe("WPStatusQuickPick test suite", () => {
  describe("constructor", () => {
    it("should construct with no errors", () => {
      const title = faker.string.alpha();
      const multiSelect = faker.datatype.boolean();
      new WPStatusQuickPick(title, multiSelect);
    });
  });
  describe("setSelectedStatuses", () => {
    let qp: WPStatusQuickPick;

    beforeEach(() => {
      qp = new WPStatusQuickPick(
        faker.string.alpha(),
        faker.datatype.boolean(),
      );
    });

    it("should change nothing if empty array passed", () => {
      const itemsCopy = [...qp["_items"]];
      qp.setPickedStatuses([]);
      expect(qp["_items"]).toEqual(itemsCopy);
    });

    it("should set picked of first item to true", () => {
      qp.setPickedStatuses([qp["_items"][0].status]);
      expect(qp["_items"][0].picked).toBeTruthy();
      expect(qp["_items"][1].picked).toBeFalsy();
    });
  });
  describe("show", () => {
    let qp: WPStatusQuickPick;
    let title: string;
    let multi: boolean;
    beforeEach(() => {
      jest.spyOn(vscode.window, "showQuickPick").mockResolvedValue(undefined);
      title = faker.string.alpha();
      multi = faker.datatype.boolean();
      qp = new WPStatusQuickPick(title, multi);
    });
    it("should show quick pick with items", async () => {
      await qp.show();

      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        qp["_items"],
        expect.anything(),
      );
    });
    it("should show quick pick with title", async () => {
      await qp.show();

      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ title }),
      );
    });
    it("should show quick pick with title", async () => {
      await qp.show();

      expect(vscode.window.showQuickPick).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ canPickMany: multi }),
      );
    });
    it("should return picked statuses", async () => {
      jest
        .spyOn(vscode.window, "showQuickPick")
        .mockResolvedValue(qp["_items"] as any);

      const statuses = qp["_items"].map((i) => i.status);

      expect(await qp.show()).toEqual(statuses);
    });
  });
});
