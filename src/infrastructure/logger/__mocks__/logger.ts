import { injectable } from "inversify";
import Logger from "../logger";

@injectable()
export default class ConsoleLogger implements Logger {
  log = jest.fn();

  error = jest.fn();
}
