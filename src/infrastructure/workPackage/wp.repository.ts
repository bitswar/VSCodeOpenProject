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

  private _onWPsChange: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onWPsChange: Event<void> = this._onWPsChange.event;

  constructor(
    @inject(TOKENS.opClient) private readonly _client: OpenProjectClient,
  ) {}

  save(wp: WP): Promise<WP> {
    return this._client.save(wp);
  }

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
      this._onWPsChange.fire();
    });
  }
}
