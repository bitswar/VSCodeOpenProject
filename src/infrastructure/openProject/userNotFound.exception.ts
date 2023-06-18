export default class UserNotFound extends Error {
  constructor() {
    super("OpenProject user was not found.");
  }
}
