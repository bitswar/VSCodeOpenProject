import { Container } from "inversify";
import "reflect-metadata";
import AuthorizeClientCommandImpl from "../application/commands/authorize/authorizeClient.command";
import AuthorizeClientCommand from "../application/commands/authorize/authorizeClientCommand.interface";
import RefreshWPsCommandImpl from "../application/commands/refresh/refreshWPs.command";
import RefreshWPsCommand from "../application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProviderImpl from "../application/views/openProject.treeDataProvider";
import OpenProjectTreeDataProvider from "../application/views/openProjectTreeDataProvider.interface";
import ConsoleLogger from "../infrastructure/logger/logger";
import Logger from "../infrastructure/logger/logger.interface";
import OpenProjectClientImpl from "../infrastructure/openProject/openProject.client";
import OpenProjectClient from "../infrastructure/openProject/openProjectClient.interface";
import TOKENS from "./tokens";

const container = new Container();

container
  .bind<AuthorizeClientCommand>(TOKENS.authorizeCommand)
  .to(AuthorizeClientCommandImpl)
  .inSingletonScope();

container
  .bind<OpenProjectClient>(TOKENS.opClient)
  .to(OpenProjectClientImpl)
  .inSingletonScope();

container
  .bind<OpenProjectTreeDataProvider>(TOKENS.opTreeView)
  .to(OpenProjectTreeDataProviderImpl)
  .inSingletonScope();

container
  .bind<RefreshWPsCommand>(TOKENS.refreshWPsCommand)
  .to(RefreshWPsCommandImpl)
  .inSingletonScope();

container.bind<Logger>(TOKENS.logger).to(ConsoleLogger).inSingletonScope();

export default container;
