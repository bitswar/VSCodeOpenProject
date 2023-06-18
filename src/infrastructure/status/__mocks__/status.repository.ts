import { injectable } from "inversify";
import StatusRepository from "../status.repository.interface";

@injectable()
export default class StatusRepositoryImpl implements StatusRepository {
  findById = jest.fn();

  findAll = jest.fn();

  refetch = jest.fn();

  onStatusesChange = jest.fn();
}
