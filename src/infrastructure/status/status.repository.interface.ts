import { Status } from "op-client";
import { Event } from "vscode";

export default interface StatusRepository {
  findById(id: number): Status;
  findAll(): Status[];
  refetch(): Promise<void>;
  onStatusesChange: Event<void>;
}
