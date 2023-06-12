import { WP } from "op-client";
import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import Filter from "../filter.interface";

export default interface StatusWPsFilter extends Filter<WP> {
  getStatusFilter(): WPStatus[] | undefined;
  setStatusFilter(wpTypes: WPStatus[]): void;
}
