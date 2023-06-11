export default class WPNotFoundException extends Error {
  constructor() {
    super("Work package was not found");
  }
}
