import { faker } from "@faker-js/faker";
import WPStatus from "../infrastructure/openProject/wpStatus.enum";
import getIconPathByStatus from "./getIconPathByStatus.util";

describe("getIconPathByStatus test suite", () => {
  describe("return correct path suite", () => {
    it("should return correct path of 'Confirmed' icon", () => {
      expect(getIconPathByStatus(WPStatus.confirmed)).toEqual(
        "resources/confirmed.png",
      );
    });
    it("should return correct path of 'In specification' icon", () => {
      expect(getIconPathByStatus(WPStatus.inSpecification)).toEqual(
        "resources/in_specification.png",
      );
    });
    it("should return correct path of 'Specified' icon", () => {
      expect(getIconPathByStatus(WPStatus.specified)).toEqual(
        "resources/specified.png",
      );
    });
    it("should return correct path of 'In progress' icon", () => {
      expect(getIconPathByStatus(WPStatus.inProgress)).toEqual(
        "resources/developing.png",
      );
    });
    it("should return correct path of 'Developed' icon", () => {
      expect(getIconPathByStatus(WPStatus.developed)).toEqual(
        "resources/developed.png",
      );
    });
    it("should return correct path of 'In testing' icon", () => {
      expect(getIconPathByStatus(WPStatus.inTesting)).toEqual(
        "resources/testing.png",
      );
    });
    it("should return correct path of 'Tested' icon", () => {
      expect(getIconPathByStatus(WPStatus.tested)).toEqual(
        "resources/tested.png",
      );
    });
    it("should return correct path of 'Test failed' icon", () => {
      expect(getIconPathByStatus(WPStatus.testFailed)).toEqual(
        "resources/failed.png",
      );
    });
    it("should return correct path of 'On hold' icon", () => {
      expect(getIconPathByStatus(WPStatus.onHold)).toEqual(
        "resources/hold.png",
      );
    });
    it("should return correct path of 'Closed' icon", () => {
      expect(getIconPathByStatus(WPStatus.closed)).toEqual(
        "resources/closed.png",
      );
    });
    it("should return correct path of 'Rejected' icon", () => {
      expect(getIconPathByStatus(WPStatus.rejected)).toEqual(
        "resources/rejected.png",
      );
    });
    it("should return undefined for new", () => {
      expect(getIconPathByStatus(WPStatus.new)).toEqual(undefined);
    });
  });

  describe("Others should get undefined", () => {
    it("should return undefined", () => {
      expect(getIconPathByStatus(faker.string.alpha() as WPStatus)).toEqual(
        undefined,
      );
    });
  });
});
