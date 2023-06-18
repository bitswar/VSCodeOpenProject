import { Project } from "op-client";
import Filter from "../filter.interface";

export default interface ProjectsFilter extends Filter<Project> {
  getProjectFilter(): number[] | undefined;
  setProjectFilter(projectIds: number[]): void;
}
