jest.mock("../../views/openProject.treeDataProvider");

import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import OpenProjectTreeDataProviderImpl from "../../views/openProject.treeDataProvider";
import RefreshWPsCommand from "./refreshWPsCommand.interface";

describe("refresh WPs command test suite", () => {
  let treeDataProvider: OpenProjectTreeDataProviderImpl;
  let command: RefreshWPsCommand;

  beforeEach(() => {
    treeDataProvider = container.get(TOKENS.opTreeView);
    command = container.get(TOKENS.refreshWPsCommand);
  });

  it("should call refreshWPs func", () => {
    jest.spyOn(treeDataProvider, "refresh");

    command.refreshWPs();

    expect(treeDataProvider.refresh).toHaveBeenCalled();
  });
});
