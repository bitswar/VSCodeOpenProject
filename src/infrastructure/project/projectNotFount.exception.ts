export default class ProjectNotFoundException extends Error {
  constructor() {
    super("Work package was not found");
  }
}
