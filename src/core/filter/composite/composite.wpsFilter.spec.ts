import { faker } from "@faker-js/faker";
import { WP } from "op-client";
import container from "../../../DI/container";
import TOKENS from "../../../DI/tokens";
import Filter from "../filter.interface";
import CompositeWPsFilterImpl from "./composite.wpsFilter";

describe("WPs composite filter test suite", () => {
  let compositeFilter: CompositeWPsFilterImpl;

  beforeEach(() => {
    compositeFilter = container.get<CompositeWPsFilterImpl>(
      TOKENS.compositeFilter,
    );
  });

  describe("filter", () => {
    let mockedFilters: Filter<WP>[];
    let mockedWPs: WP[];

    beforeAll(() => {
      mockedFilters = faker.helpers.uniqueArray(
        () => ({ filter: jest.fn(), onFilterUpdated: jest.fn() }),
        5,
      );
      mockedWPs = faker.helpers.uniqueArray(
        () => new WP(faker.number.int()),
        5,
      );
    });

    it("should return wps untouched if no filters pushed", () => {
      const filteredWps = compositeFilter.filter(mockedWPs);
      expect(filteredWps).toEqual(mockedWPs);
    });
    it("should call every filters 'filter' function", () => {
      mockedFilters.forEach((filter) => {
        jest.spyOn(filter, "filter").mockImplementation((wps) => wps);
        compositeFilter.pushFilter(filter);
      });

      compositeFilter.filter(mockedWPs);

      mockedFilters.forEach((filter) => {
        expect(filter.filter).toHaveBeenLastCalledWith(mockedWPs);
      });
    });
    it("should call every filters 'filter' function", () => {
      mockedFilters.forEach((filter) => {
        jest.spyOn(filter, "filter").mockImplementation((wps) => {
          wps.pop();
          return wps;
        });
        compositeFilter.pushFilter(filter);
      });

      const filteredWPs = compositeFilter.filter(mockedWPs);
      expect(filteredWPs).toEqual(mockedWPs);
    });
  });

  describe("pushFilter", () => {
    it("should add filter to list", () => {
      const filter: Filter<WP> = {
        filter: jest.fn(),
        onFilterUpdated: jest.fn(),
      };
      compositeFilter.pushFilter(filter);
      expect(compositeFilter["_filters"]).toEqual(
        expect.arrayContaining([filter]),
      );
    });
    it("should subscribe to filters onFilterChange", () => {
      const onFilterUpdatedMocked = jest.fn();
      const filter: Filter<WP> = {
        filter: jest.fn(),
        onFilterUpdated: onFilterUpdatedMocked,
      };
      compositeFilter.pushFilter(filter);
      expect(onFilterUpdatedMocked).toHaveBeenCalled();
    });
  });
});
