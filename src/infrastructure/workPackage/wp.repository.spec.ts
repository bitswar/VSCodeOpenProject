jest.mock("../openProject/openProject.client");
jest.mock("../../core/filter/composite/composite.wpsFilter.interface");

import { Project, WP } from "op-client";
import container from "../../DI/container";
import TOKENS from "../../DI/tokens";
import CompositeWPsFilter from "../../core/filter/composite/composite.wpsFilter.interface";
import OpenProjectClient from "../openProject/openProject.client.interface";
import WPRepositoryImpl from "./wp.repository";
import WPNotFoundException from "./wpNotFount.exception";

describe("WP repository test suite", () => {
  const client = container.get<OpenProjectClient>(TOKENS.opClient);
  const filter = container.get<CompositeWPsFilter>(TOKENS.compositeFilter);
  const repository = container.get<WPRepositoryImpl>(TOKENS.wpRepository);
  const wp1 = new WP(1);
  const wp2 = new WP(2);
  const wp3 = new WP(3);
  const wp4 = new WP(4);
  const wp5 = new WP(5);
  const project1 = new Project(1);
  const project2 = new Project(2);
  const project3 = new Project(3);
  const project4 = new Project(4);

  beforeAll(async () => {
    wp2.parent = wp1;
    wp3.parent = wp1;
    wp4.parent = wp2;
    wp1.project = project1;
    wp2.project = project2;
    wp3.project = project2;
    wp4.project = project3;

    jest.spyOn(client, "getWPs").mockResolvedValue([wp1, wp2, wp3, wp4]);
    await repository.refetch();
  });

  describe("findById", () => {
    it("should return wp1", () => {
      expect(repository.findById(wp1.id)).toEqual(wp1);
    });
    it("should return wp2 by id", () => {
      expect(repository.findById(wp2.id)).toEqual(wp2);
    });
    it("should return wp3 by id", () => {
      expect(repository.findById(wp3.id)).toEqual(wp3);
    });
    it("should return wp4 by id", () => {
      expect(repository.findById(wp4.id)).toEqual(wp4);
    });
    it("should throw WPNotFoundException", () => {
      expect(() => repository.findById(wp5.id)).toThrowError(
        WPNotFoundException,
      );
    });
  });

  describe("findByParentId", () => {
    beforeAll(() => {
      jest.spyOn(filter, "filter").mockReturnValue([wp1, wp2, wp3, wp4]);
    });
    it("should return children of wp1", () => {
      expect(repository.findByParentId(wp1.id)).toEqual([wp2, wp3]);
    });
    it("should return children of wp2", () => {
      expect(repository.findByParentId(wp2.id)).toEqual([wp4]);
    });
    it("should return children of wp4", () => {
      expect(repository.findByParentId(wp4.id)).toEqual([]);
    });
  });

  describe("findByProjectId", () => {
    beforeAll(() => {
      jest.spyOn(filter, "filter").mockReturnValue([wp1, wp2, wp3, wp4]);
    });
    it("should return projects of project1", () => {
      expect(repository.findByProjectId(project1.id)).toEqual([wp1]);
    });
    it("should return projects of project2", () => {
      expect(repository.findByProjectId(project2.id)).toEqual([wp2, wp3]);
    });
    it("should return projects of project3", () => {
      expect(repository.findByProjectId(project3.id)).toEqual([wp4]);
    });
    it("should return empty array", () => {
      expect(repository.findByProjectId(project4.id)).toEqual([]);
    });
  });

  describe("findAll", () => {
    beforeAll(() => {
      jest.spyOn(filter, "filter").mockReturnValue([wp1, wp2, wp3, wp4]);
    });
    it("should return all wps", () => {
      expect(repository.findAll()).toEqual([wp1, wp2, wp3, wp4]);
    });
  });

  describe("refetch", () => {
    it("should call client getWPs again", () => {
      repository.refetch();
      expect(client.getWPs).toHaveBeenCalled();
    });
  });
});
