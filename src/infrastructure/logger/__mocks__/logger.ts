import { injectable } from "inversify";
import Logger from "../logger";

@injectable()
export default class ConsoleLogger implements Logger {
  debug = jest.fn();

  log = jest.fn();

  error = jest.fn();
}
