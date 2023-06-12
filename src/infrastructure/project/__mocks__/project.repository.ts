import { injectable } from "inversify";
import ProjectRepository from "../project.repository.interface";

@injectable()
export default class ProjectRepositoryImpl implements ProjectRepository {
  findById = jest.fn();

  findAll = jest.fn();

  refetch = jest.fn();

  onProjectsChange = jest.fn();

  penis = "asd";
}
