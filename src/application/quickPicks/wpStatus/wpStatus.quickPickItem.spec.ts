import { Status } from "op-client";
import WPStatusQuickPickItem from "./wpStatus.quickPickItem";

describe("wpStatus quick pick item test suite", () => {
  it("should have status as label", () => {
    const status = new Status(1);
    status.body.name = "New";

    const item = new WPStatusQuickPickItem(status);

    expect(item.label).toEqual(status.body.name);
  });
  it("should have status as status", () => {
    const status = new Status(1);

    const item = new WPStatusQuickPickItem(status);

    expect(item.status).toEqual(status);
  });
  it("should have picked = true", () => {
    const status = new Status(1);
    const picked = true;

    const item = new WPStatusQuickPickItem(status, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false", () => {
    const status = new Status(1);
    const picked = false;

    const item = new WPStatusQuickPickItem(status, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false if no picked passed", () => {
    const status = new Status(1);

    const item = new WPStatusQuickPickItem(status);

    expect(item.picked).toEqual(false);
  });
});
