import WPsFilter from "../wpsFilter.interface";

export default interface ProjectWPsFilter extends WPsFilter {
  getProjectFilter(): number[] | undefined;
  setProjectFilter(projectIds: number[]): void;
}
