import { Container } from "inversify";
import "reflect-metadata";
import AuthorizeClientCommandImpl from "../application/commands/authorize/authorizeClient.command";
import AuthorizeClientCommand from "../application/commands/authorize/authorizeClientCommand.interface";
import SetupFiltersCommandImpl from "../application/commands/filter/setupFilters.command";
import SetupFiltersCommand from "../application/commands/filter/setupFilters.command.interface";
import RefreshWPsCommandImpl from "../application/commands/refresh/refreshWPs.command";
import RefreshWPsCommand from "../application/commands/refresh/refreshWPsCommand.interface";
import OpenProjectTreeDataProviderImpl from "../application/views/openProject.treeDataProvider";
import OpenProjectTreeDataProvider from "../application/views/openProjectTreeDataProvider.interface";
import CompositeWPsFilterImpl from "../core/filter/composite/composite.wpsFilter";
import CompositeWPsFilter from "../core/filter/composite/composite.wpsFilter.interface";
import ProjectsFilterImpl from "../core/filter/project/project.filter";
import ProjectsFilter from "../core/filter/project/project.filter.interface";
import StatusWPsFilterImpl from "../core/filter/status/status.wpsFilter";
import StatusWPsFilter from "../core/filter/status/status.wpsFilter.interface";
import TextWPsFilterImpl from "../core/filter/text/text.wpsFilter";
import TextWPsFilter from "../core/filter/text/text.wpsFilter.interface";
import ConsoleLogger from "../infrastructure/logger/logger";
import Logger from "../infrastructure/logger/logger.interface";
import OpenProjectClientImpl from "../infrastructure/openProject/openProject.client";
import OpenProjectClient from "../infrastructure/openProject/openProject.client.interface";
import ProjectRepositoryImpl from "../infrastructure/project/project.repository";
import ProjectRepository from "../infrastructure/project/project.repository.interface";
import WPRepositoryImpl from "../infrastructure/workPackage/wp.repository";
import WPRepository from "../infrastructure/workPackage/wp.repository.interface";
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

container
  .bind<TextWPsFilter>(TOKENS.textFilter)
  .to(TextWPsFilterImpl)
  .inSingletonScope();

container
  .bind<ProjectsFilter>(TOKENS.projectFilter)
  .to(ProjectsFilterImpl)
  .inSingletonScope();

container
  .bind<StatusWPsFilter>(TOKENS.statusFilter)
  .to(StatusWPsFilterImpl)
  .inSingletonScope();

container
  .bind<CompositeWPsFilter>(TOKENS.compositeFilter)
  .to(CompositeWPsFilterImpl)
  .inSingletonScope();

container
  .bind<WPRepository>(TOKENS.wpRepository)
  .to(WPRepositoryImpl)
  .inSingletonScope();

container
  .bind<ProjectRepository>(TOKENS.projectRepository)
  .to(ProjectRepositoryImpl)
  .inSingletonScope();

container
  .bind<SetupFiltersCommand>(TOKENS.setupFiltersCommand)
  .to(SetupFiltersCommandImpl)
  .inSingletonScope();

container.bind<Logger>(TOKENS.logger).to(ConsoleLogger).inSingletonScope();

export default container;
