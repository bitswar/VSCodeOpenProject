import { injectable } from "inversify";
import OpenProjectClient from "../openProject.client.interface";

@injectable()
export default class OpenProjectClientImpl implements OpenProjectClient {
  getStatuses = jest.fn();

  save = jest.fn();

  getProjects = jest.fn();

  onInit = jest.fn();

  init = jest.fn();

  getUser = jest.fn();

  getWPs = jest.fn();
}
