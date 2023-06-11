import { injectable } from "inversify";
import Logger from "./logger.interface";

@injectable()
export default class ConsoleLogger implements Logger {
  log(...messages: unknown[]): void {
    console.log(...messages);
  }

  error(...messages: unknown[]): void {
    console.error(...messages);
  }
}
