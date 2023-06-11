import { injectable } from "inversify";
import WPRepository from "../wp.repository.interface";

@injectable()
export default class WPRepositoryImpl implements WPRepository {
  findById = jest.fn();

  findByParentId = jest.fn();

  findAll = jest.fn();

  refetch = jest.fn();

  onWPsRefetch = jest.fn();

  findByProjectId = jest.fn();
}
