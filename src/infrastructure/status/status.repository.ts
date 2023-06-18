import { inject, injectable } from "inversify";
import { Status } from "op-client";
import * as vscode from "vscode";
import { Event } from "vscode";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../openProject/openProject.client.interface";
import StatusRepository from "./status.repository.interface";
import StatusNotFoundException from "./statusNotFound.exception";

@injectable()
export default class StatusRepositoryImpl implements StatusRepository {
  private _statuses: Status[] = [];

  private _onStatusesChange: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onStatusesChange: Event<void> = this._onStatusesChange.event;

  constructor(
    @inject(TOKENS.opClient) private readonly _client: OpenProjectClient,
  ) {
    this._client.onInit(() => this.refetch());
  }

  findById(id: number): Status {
    const result = this._statuses.find((wp) => wp.id === id);
    if (!result) throw new StatusNotFoundException();
    return result;
  }

  findAll(): Status[] {
    return this._statuses;
  }

  refetch(): Promise<void> {
    return this._client.getStatuses().then((statuses) => {
      this._statuses = statuses;
      this._onStatusesChange.fire();
    });
  }
}
