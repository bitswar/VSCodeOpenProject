import { Project, User, WP } from "op-client";
import * as vscode from "vscode";

export default interface OpenProjectClient {
  init(baseUrl: string, token: string): void;
  getUser(): Promise<User>;
  getWPs(): Promise<WP[]>;
  getProjects(): Promise<Project[]>;

  onInit: vscode.Event<void>;
}
