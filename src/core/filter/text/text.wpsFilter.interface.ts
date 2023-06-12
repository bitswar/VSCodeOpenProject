import { WP } from "op-client";
import Filter from "../filter.interface";

export default interface TextWPsFilter extends Filter<WP> {
  getTextFilter(): string;
  setTextFilter(filter: string): void;
}
