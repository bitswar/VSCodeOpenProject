import { inject, injectable } from "inversify";
import { WP } from "op-client";
import * as vscode from "vscode";
import { Event } from "vscode";
import TOKENS from "../../DI/tokens";
import OpenProjectClient from "../openProject/openProject.client.interface";
import WPRepository from "./wp.repository.interface";
import WPNotFoundException from "./wpNotFount.exception";

@injectable()
export default class WPRepositoryImpl implements WPRepository {
  private _wps: WP[] = [];

  private _onWPsRefetch: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onWPsRefetch: Event<void> = this._onWPsRefetch.event;

  constructor(
    @inject(TOKENS.opClient) private readonly _client: OpenProjectClient,
  ) {}

  findById(id: number): WP {
    const result = this._wps.find((wp) => wp.id === id);
    if (!result) throw new WPNotFoundException();
    return result;
  }

  findByParentId(parentId: number): WP[] {
    return this._wps.filter((wp) => wp.parent?.id === parentId);
  }

  findByProjectId(projectId: number): WP[] {
    return this._wps.filter((wp) => wp.project.id === projectId);
  }

  findAll(): WP[] {
    return this._wps;
  }

  refetch(): Promise<void> {
    return this._client.getWPs().then((wps) => {
      this._wps = wps;
      this._onWPsRefetch.fire();
    });
  }
}
