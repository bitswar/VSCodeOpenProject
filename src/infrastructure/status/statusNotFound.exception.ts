export default class StatusNotFoundException extends Error {
  constructor() {
    super("Work package was not found");
  }
}
