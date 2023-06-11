import { injectable } from "inversify";
import StatusWPsFilter from "../status.wpsFilter.interface";

@injectable()
export default class StatusWPsFilterImpl implements StatusWPsFilter {
  filter = jest.fn();

  onFilterUpdated = jest.fn();

  getStatusFilter = jest.fn();

  setStatusFilter = jest.fn();
}
