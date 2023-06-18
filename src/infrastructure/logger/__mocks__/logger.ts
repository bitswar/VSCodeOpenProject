import { injectable } from "inversify";
import Logger from "../logger.interface";

@injectable()
export default class ConsoleLogger implements Logger {
  debug = jest.fn();

  log = jest.fn();

  error = jest.fn();
}
