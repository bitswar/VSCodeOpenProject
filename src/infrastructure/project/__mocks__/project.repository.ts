import { injectable } from "inversify";
import ProjectRepository from "../project.repository.interface";

@injectable()
export default class ProjectRepositoryImpl implements ProjectRepository {
  findById = jest.fn();

  findAll = jest.fn();

  refetch = jest.fn();

  onProjectsRefetch = jest.fn();

  penis = "asd";
}
