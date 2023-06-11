import { injectable } from "inversify";
import OpenProjectClient from "../openProjectClient.interface";

@injectable()
export default class OpenProjectClientImpl implements OpenProjectClient {
  init = jest.fn();

  getUser = jest.fn();

  getWPs = jest.fn();
}
