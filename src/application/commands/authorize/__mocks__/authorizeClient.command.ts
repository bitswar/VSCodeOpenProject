import { injectable } from "inversify";
import AuthorizeClientCommand from "../authorizeClientCommand.interface";

@injectable()
export default class AuthorizeClientCommandImpl
  implements AuthorizeClientCommand
{
  authorizeClient = jest.fn();
}
