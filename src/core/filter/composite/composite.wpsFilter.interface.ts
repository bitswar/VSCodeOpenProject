import WPsFilter from "../wpsFilter.interface";

export default interface CompositeWPsFilter extends WPsFilter {
  pushFilter(filter: WPsFilter): void;
}
