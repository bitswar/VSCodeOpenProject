import { WP } from "op-client";
import Filter from "../filter.interface";

export default interface CompositeWPsFilter extends Filter<WP> {
  pushFilter(filter: Filter<WP>): void;
}
