/* eslint-disable no-new */
import { faker } from "@faker-js/faker";
import { Status } from "op-client";
import * as vscode from "vscode";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPStatusQuickPick from "./wpStatus.quickPick";

describe("WPStatusQuickPick test suite", () => {
  let statuses = Object.values(WPStatus).map(
    (wpStatus, i) => new Status({ name: wpStatus, id: i } as any),
  );

  describe("constructor", () => {
    it("should construct with no errors", () => {
      const title = faker.string.alpha();
      const multiSelect = faker.datatype.boolean();
      new WPStatusQuickPick(title, statuses, multiSelect);
    });
  });
  describe("setSelectedStatuses", () => {
    let qp: WPStatusQuickPick;

    beforeEach(() => {
      qp = new WPStatusQuickPick(
        faker.string.alpha(),
        statuses,
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
    it("should set picked of first item if WPStatus passed", () => {
      qp.setPickedStatuses([Object.values(WPStatus)[0]]);
      expect(qp["_items"][0].picked).toBeTruthy();
      expect(qp["_items"][1].picked).toBeFalsy();
    });
    it("should set picked of first item if number passed", () => {
      qp.setPickedStatuses([0]);
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
      qp = new WPStatusQuickPick(title, [new Status(1)], multi);
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

      statuses = qp["_items"].map((i) => i.status);

      expect(await qp.show()).toEqual(statuses);
    });
    it("should return one picked status", async () => {
      jest
        .spyOn(vscode.window, "showQuickPick")
        .mockResolvedValue(qp["_items"][0]);

      expect(await qp.show()).toEqual(qp["_items"][0].status);
    });
  });
});
