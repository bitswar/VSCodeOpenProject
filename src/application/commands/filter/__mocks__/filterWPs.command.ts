import { injectable } from "inversify";
import SetupFiltersCommand from "../setupFilters.command.interface";

@injectable()
export default class FilterWPsCommandImpl implements SetupFiltersCommand {
  setupFilters = jest.fn();
}
