jest.mock("../views/openProject.treeDataProvider");

import OpenProjectTreeDataProvider from "../views/openProject.treeDataProvider";
import refreshWPs from "./refreshWPs.command";

describe("refresh WPs command test suit", () => {
  it("should call refreshWPs func", () => {
    const treeDataProvider = { refreshWPs: jest.fn() };

    jest
      .spyOn(OpenProjectTreeDataProvider, "getInstance")
      .mockReturnValue(treeDataProvider as any);

    jest.spyOn(treeDataProvider, "refreshWPs");

    refreshWPs();

    expect(treeDataProvider.refreshWPs).toHaveBeenCalled();
  });
});
