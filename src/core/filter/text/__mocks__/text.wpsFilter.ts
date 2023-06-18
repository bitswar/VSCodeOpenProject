import { injectable } from "inversify";
import TextWPsFilter from "../text.wpsFilter.interface";

@injectable()
export default class TextWPsFilterImpl implements TextWPsFilter {
  filter = jest.fn();

  onFilterUpdated = jest.fn();

  getTextFilter = jest.fn();

  setTextFilter = jest.fn();
}
