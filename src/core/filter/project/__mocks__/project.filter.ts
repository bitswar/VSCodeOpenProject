import { injectable } from "inversify";
import ProjectsFilter from "../project.filter.interface";

@injectable()
export default class ProjectsFilterImpl implements ProjectsFilter {
  filter = jest.fn();

  onFilterUpdated = jest.fn();

  getProjectFilter = jest.fn();

  setProjectFilter = jest.fn();
}
