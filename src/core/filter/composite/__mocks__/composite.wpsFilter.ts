import { injectable } from "inversify";
import CompositeWPsFilter from "../composite.wpsFilter.interface";

@injectable()
export default class CompositeWPsFilterImpl implements CompositeWPsFilter {
  filter = jest.fn();

  onFilterUpdated = jest.fn();

  pushFilter = jest.fn();
}
