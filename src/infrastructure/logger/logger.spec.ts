import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import Logger from "./logger";

describe("ConsoleLogger tests suite", () => {
  let logger: Logger;

  beforeAll(() => {
    logger = container.get(TOKENS.logger);
  });

  it("should call console.log", () => {
    const message = "Hello World!";

    jest.spyOn(console, "log");

    logger.log(message);

    expect(console.log).toHaveBeenLastCalledWith(message);
  });

  it("should call console.debug", () => {
    const message = "Debug message!";

    jest.spyOn(console, "debug");

    logger.debug(message);

    expect(console.debug).toHaveBeenLastCalledWith(message);
  });

  it("should call console.error", () => {
    const message = "Error happened!";

    jest.spyOn(console, "error");

    logger.error(message);

    expect(console.error).toHaveBeenLastCalledWith(message);
  });
});
