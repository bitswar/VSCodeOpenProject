import WPsFilter from "../wpsFilter.interface";

export default interface TextWPsFilter extends WPsFilter {
  getTextFilter(): string;
  setTextFilter(filter: string): void;
}
