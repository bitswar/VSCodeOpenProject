import ClientOAuth2 from "client-oauth2";
import { inject, injectable } from "inversify";
import { EntityManager, User, WP } from "op-client";
import TOKENS from "../../DI/tokens";
import addCredsToUrl from "../../utils/addCredsToUrl.util";
import Logger from "../logger/logger";
import ClientNotInitializedException from "./clientNotInitialized.exception";
import OpenProjectClient from "./openProjectClient.interface";
import UnexceptedClientException from "./unexpectedClientError.exception";
import UserNotFound from "./userNotFound.exception";

@injectable()
export default class OpenProjectClientImpl implements OpenProjectClient {
  constructor(@inject(TOKENS.logger) private readonly _logger: Logger) {}

  private _entityManager?: EntityManager | undefined;

  private get entityManager(): EntityManager {
    if (!this._entityManager) throw new ClientNotInitializedException();
    return this._entityManager;
  }

  private set entityManager(value: EntityManager) {
    this._entityManager = value;
  }

  public init(baseUrl: string, token: string): Promise<User | undefined> {
    this.entityManager = new EntityManager({
      baseUrl: this.addTokenToUrl(baseUrl, token),
      createLogger: this.getLogger,
      token: new ClientOAuth2({}).createToken(token, {}),
    });
    return this.getUser();
  }

  public getUser(): Promise<User | undefined> {
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

  private addTokenToUrl(baseUrl: string, token: string) {
    return addCredsToUrl(baseUrl, "apikey", token);
  }

  private getLogger(): Logger {
    return this._logger;
  }
}
