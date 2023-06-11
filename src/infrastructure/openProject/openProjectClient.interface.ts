import { User, WP } from "op-client";

export default interface OpenProjectClient {
  init(baseUrl: string, token: string): Promise<User | undefined>;
  getUser(): Promise<User | undefined>;
  getWPs(): Promise<WP[]>;
}
