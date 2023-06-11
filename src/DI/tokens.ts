const TOKENS = {
  opTreeView: Symbol.for("OpenProjectTreeDataProvider"),
  opClient: Symbol.for("OpenProjectClient"),
  refreshWPsCommand: Symbol.for("RefreshWPsCommand"),
  authorizeCommand: Symbol.for("AuthorizeClientCommand"),
  logger: Symbol.for("Logger"),
  wpRepository: Symbol.for("WPRepository"),
  projectRepository: Symbol.for("ProjectRepository"),
};

export default TOKENS;
