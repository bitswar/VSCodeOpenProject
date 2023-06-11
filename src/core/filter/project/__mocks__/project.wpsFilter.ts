import { injectable } from "inversify";
import ProjectWPsFilter from "../project.wpsFilter.interface";

@injectable()
export default class ProjectWPsFilterImpl implements ProjectWPsFilter {
  filter = jest.fn();

  onFilterUpdated = jest.fn();

  getProjectFilter = jest.fn();

  setProjectFilter = jest.fn();
}
