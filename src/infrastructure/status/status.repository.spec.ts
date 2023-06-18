jest.mock("../openProject/openProject.client");

import { Status } from "op-client";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../openProject/openProject.client.interface";
import StatusRepository from "./status.repository.interface";
import StatusNotFoundException from "./statusNotFound.exception";

describe("Status repository test suite", () => {
  const client = container.get<OpenProjectClient>(TOKENS.opClient);
  const repository = container.get<StatusRepository>(TOKENS.statusRepository);
  const status1 = new Status(1);
  const status2 = new Status(2);
  const status3 = new Status(3);
  const status4 = new Status(4);
  const status5 = new Status(5);

  beforeAll(async () => {
    jest
      .spyOn(client, "getStatuses")
      .mockResolvedValue([status1, status2, status3, status4]);
    await repository.refetch();
  });

  describe("findById", () => {
    it("should return status1", () => {
      expect(repository.findById(status1.id)).toEqual(status1);
    });
    it("should return status2 by id", () => {
      expect(repository.findById(status2.id)).toEqual(status2);
    });
    it("should return status3 by id", () => {
      expect(repository.findById(status3.id)).toEqual(status3);
    });
    it("should return status4 by id", () => {
      expect(repository.findById(status4.id)).toEqual(status4);
    });
    it("should throw ProjectNotFoundException", () => {
      expect(() => repository.findById(status5.id)).toThrowError(
        StatusNotFoundException,
      );
    });
  });

  describe("findAll", () => {
    it("should return all statuss", () => {
      expect(repository.findAll()).toEqual([
        status1,
        status2,
        status3,
        status4,
      ]);
    });
  });

  describe("refetch", () => {
    it("should call client getStatuses again", () => {
      repository.refetch();
      expect(client.getStatuses).toHaveBeenCalled();
    });
  });
});
