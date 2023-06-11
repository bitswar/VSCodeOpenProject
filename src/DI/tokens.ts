const TOKENS = {
  opTreeView: Symbol.for("OpenProjectTreeDataProvider"),
  opClient: Symbol.for("OpenProjectClient"),
  refreshWPsCommand: Symbol.for("RefreshWPsCommand"),
  authorizeCommand: Symbol.for("AuthorizeClientCommand"),
  logger: Symbol.for("Logger"),
  textFilter: Symbol.for("TextWPsFilter"),
  projectFilter: Symbol.for("ProjectWPsFilter"),
  statusFilter: Symbol.for("StatusWPsFilter"),
  wpRepository: Symbol.for("WPRepository"),
  projectRepository: Symbol.for("ProjectRepository"),
};

export default TOKENS;
