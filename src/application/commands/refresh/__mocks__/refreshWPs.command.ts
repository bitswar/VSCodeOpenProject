import { injectable } from "inversify";
import RefreshWPsCommand from "../refreshWPsCommand.interface";

@injectable()
export default class RefreshWPsCommandImpl implements RefreshWPsCommand {
  refreshWPs = jest.fn();
}
