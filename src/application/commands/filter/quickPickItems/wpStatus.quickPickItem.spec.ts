import WPStatus from "../../../../infrastructure/openProject/wpStatus.enum";
import WPStatusQuickPickItem from "./wpStatus.quickPickItem";

describe("wpStatus quick pick item test suite", () => {
  it("should have status as label", () => {
    const status = WPStatus.closed;

    const item = new WPStatusQuickPickItem(status);

    expect(item.label).toEqual(status);
  });
  it("should have status as status", () => {
    const status = WPStatus.closed;

    const item = new WPStatusQuickPickItem(status);

    expect(item.status).toEqual(status);
  });
  it("should have picked = true", () => {
    const status = WPStatus.closed;
    const picked = true;

    const item = new WPStatusQuickPickItem(status, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false", () => {
    const status = WPStatus.closed;
    const picked = false;

    const item = new WPStatusQuickPickItem(status, picked);

    expect(item.picked).toEqual(picked);
  });
  it("should have picked = false if no picked passed", () => {
    const status = WPStatus.closed;

    const item = new WPStatusQuickPickItem(status);

    expect(item.picked).toEqual(false);
  });
});
