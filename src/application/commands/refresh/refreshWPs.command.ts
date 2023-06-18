import { inject, injectable } from "inversify";
import TOKENS from "../../../DI/tokens";
import OpenProjectTreeDataProvider from "../../views/openProject.treeDataProvider.interface";
import RefreshWPsCommand from "./refreshWPsCommand.interface";

@injectable()
export default class RefreshWPsCommandImpl implements RefreshWPsCommand {
  constructor(
    @inject(TOKENS.opTreeView)
    private readonly _treeDataProvider: OpenProjectTreeDataProvider,
  ) {}

  refreshWPs() {
    this._treeDataProvider.refresh();
  }
}
