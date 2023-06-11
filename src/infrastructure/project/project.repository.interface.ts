import { Project } from "op-client";
import { Event } from "vscode";

export default interface ProjectRepository {
  findById(id: number): Project;
  findAll(): Project[];
  refetch(): Promise<void>;
  onProjectsRefetch: Event<void>;
}
