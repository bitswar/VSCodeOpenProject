export default class ClientNotInitializedException extends Error {
  constructor() {
    super("OpenProjectClient is used before initialization.");
  }
}
