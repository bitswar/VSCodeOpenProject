import ClientOAuth2 from "client-oauth2";
import { inject, injectable } from "inversify";
import { EntityManager, Project, User, WP } from "op-client";
import * as vscode from "vscode";
import TOKENS from "../../DI/tokens";
import addCredsToUrl from "../../utils/addCredsToUrl.util";
import Logger from "../logger/logger";
import ClientNotInitializedException from "./clientNotInitialized.exception";
import OpenProjectClient from "./openProject.client.interface";
import UnexceptedClientException from "./unexpectedClientError.exception";
import UserNotFound from "./userNotFound.exception";

@injectable()
export default class OpenProjectClientImpl implements OpenProjectClient {
  private _onInit = new vscode.EventEmitter<void>();

  private _entityManager?: EntityManager | undefined;

  onInit = this._onInit.event;

  constructor(@inject(TOKENS.logger) private readonly _logger: Logger) {}

  private get entityManager(): EntityManager {
    if (!this._entityManager) throw new ClientNotInitializedException();
    return this._entityManager;
  }

  private set entityManager(value: EntityManager) {
    this._entityManager = value;
  }

  public init(baseUrl: string, token: string): void {
    this.entityManager = new EntityManager({
      baseUrl: this.addTokenToUrl(baseUrl, token),
      createLogger: () => this._logger,
      token: new ClientOAuth2({}).createToken(token, {}),
    });
    this._onInit.fire();
  }

  public getUser(): Promise<User> {
    return this.entityManager
      .fetch("api/v3/users/me")
      .then((response) => {
        if (!response) throw new UserNotFound();
        return new User(response);
      })
      .catch((err) => {
        if (
          err instanceof UserNotFound ||
          err instanceof ClientNotInitializedException
        ) {
          throw err;
        }
        this._logger.error(err);
        throw new UnexceptedClientException();
      });
  }

  public getWPs(): Promise<WP[]> {
    return this.entityManager.getMany<WP>(WP, {
      pageSize: 100,
      all: true,
      filters: [],
    });
  }

  public getProjects(): Promise<Project[]> {
    return this.entityManager.getMany<Project>(Project, {
      pageSize: 100,
      all: true,
      filters: [],
    });
  }

  private addTokenToUrl(baseUrl: string, token: string) {
    return addCredsToUrl(baseUrl, "apikey", token);
  }
}
