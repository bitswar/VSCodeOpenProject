import { Status, WP } from "op-client";
import Filter from "../filter.interface";

export default interface StatusWPsFilter extends Filter<WP> {
  getStatusFilter(): number[] | undefined;
  setStatusFilter(statuses: number[] | Status[]): void;
}
