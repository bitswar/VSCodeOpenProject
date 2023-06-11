import WPStatus from "../../../infrastructure/openProject/wpStatus.enum";
import WPsFilter from "../wpsFilter.interface";

export default interface StatusWPsFilter extends WPsFilter {
  getStatusFilter(): WPStatus[] | undefined;
  setStatusFilter(wpTypes: WPStatus[]): void;
}
