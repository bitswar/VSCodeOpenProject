const repositoryTokens = {
  wpRepository: Symbol.for("WPRepository"),
  projectRepository: Symbol.for("ProjectRepository"),
};

const comandTokens = {
  refreshWPsCommand: Symbol.for("RefreshWPsCommand"),
  authorizeCommand: Symbol.for("AuthorizeClientCommand"),
  setupFiltersCommand: Symbol.for("FilterWPsCommand"),
};

const filterTokens = {
  filter: Symbol.for("filter"),
  textFilter: Symbol.for("TextWPsFilter"),
  projectFilter: Symbol.for("ProjectWPsFilter"),
  statusFilter: Symbol.for("StatusWPsFilter"),
  compositeFilter: Symbol.for("CompositeWPsFilter"),
};

const TOKENS = {
  opTreeView: Symbol.for("OpenProjectTreeDataProvider"),
  opClient: Symbol.for("OpenProjectClient"),
  logger: Symbol.for("Logger"),
  ...comandTokens,
  ...repositoryTokens,
  ...filterTokens,
};

export default TOKENS;
