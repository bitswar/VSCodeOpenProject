import { faker } from "@faker-js/faker";
import getIconPathByStatus from "./getIconPathByStatus.util";

describe("getIconPathByStatus test suite", () => {
  describe("return correct path suite", () => {
    it("should return correct path of 'Confirmed' icon", () => {
      expect(getIconPathByStatus("Confirmed")).toEqual(
        "resources/confirmed.png",
      );
    });
    it("should return correct path of 'In specification' icon", () => {
      expect(getIconPathByStatus("In specification")).toEqual(
        "resources/in_specification.png",
      );
    });
    it("should return correct path of 'Specified' icon", () => {
      expect(getIconPathByStatus("Specified")).toEqual(
        "resources/specified.png",
      );
    });
    it("should return correct path of 'In progress' icon", () => {
      expect(getIconPathByStatus("In progress")).toEqual(
        "resources/developing.png",
      );
    });
    it("should return correct path of 'Developed' icon", () => {
      expect(getIconPathByStatus("Developed")).toEqual(
        "resources/developed.png",
      );
    });
    it("should return correct path of 'In testing' icon", () => {
      expect(getIconPathByStatus("In testing")).toEqual(
        "resources/testing.png",
      );
    });
    it("should return correct path of 'Tested' icon", () => {
      expect(getIconPathByStatus("Tested")).toEqual("resources/tested.png");
    });
    it("should return correct path of 'Test failed' icon", () => {
      expect(getIconPathByStatus("Test failed")).toEqual(
        "resources/failed.png",
      );
    });
    it("should return correct path of 'On hold' icon", () => {
      expect(getIconPathByStatus("On hold")).toEqual("resources/hold.png");
    });
    it("should return correct path of 'Closed' icon", () => {
      expect(getIconPathByStatus("Closed")).toEqual("resources/closed.png");
    });
    it("should return correct path of 'Rejected' icon", () => {
      expect(getIconPathByStatus("Rejected")).toEqual("resources/rejected.png");
    });
    it("should return undefined for new", () => {
      expect(getIconPathByStatus("New")).toEqual(undefined);
    });
  });

  describe("Others should get undefined", () => {
    it("should return undefined", () => {
      expect(getIconPathByStatus(faker.string.alpha())).toEqual(undefined);
    });
  });
});
