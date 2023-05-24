import { EntityManager, User, WP } from "op-client";
import { URL } from "url";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention, import/no-extraneous-dependencies
const ClientOAuth2 = require("client-oauth2");

export default class OpenProjectClient {
  private static _instance: OpenProjectClient;

  public static getInstance(): OpenProjectClient {
    if (!this._instance) {
      this._instance = new OpenProjectClient();
    }
    return this._instance;
  }

  private entityManager?: EntityManager;

  public init(
    baseUrl: string,
    token: string,
  ): Promise<User | undefined> | undefined {
    this.entityManager = new EntityManager({
      baseUrl: addTokenToUrl(baseUrl, token),
      createLogger,
      token: new ClientOAuth2({}).createToken(token, {}),
    });
    return this.getUser();
  }

  public getUser(): Promise<User | undefined> | undefined {
    return this.entityManager
      ?.fetch("api/v3/users/me")
      .then((response) => new User(response))
      .catch((err) => {
        console.error(err);
        return undefined;
      });
  }

  public getWPs(): Promise<WP[]> | undefined {
    return this.entityManager?.getMany<WP>(WP, {
      pageSize: 100,
      all: true,
      filters: [],
    });
  }
}

/**
 * makes http://apikey:*token*@google.com out of http://google.com
 * @param url url to which we want to add token
 * @param token api token
 * @returns url with token
 */
export function addTokenToUrl(url: string, token: string): string {
  const parsedUrl = new URL(url);
  parsedUrl.username = "apikey";
  parsedUrl.password = token;
  return parsedUrl.toString();
}

export function createLogger() {
  return console;
}
