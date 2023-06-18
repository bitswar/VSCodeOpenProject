import { injectable } from "inversify";
import WPRepository from "../wp.repository.interface";

@injectable()
export default class WPRepositoryImpl implements WPRepository {
  save = jest.fn();

  findById = jest.fn();

  findByParentId = jest.fn();

  findAll = jest.fn();

  refetch = jest.fn();

  onWPsChange = jest.fn();

  findByProjectId = jest.fn();
}
