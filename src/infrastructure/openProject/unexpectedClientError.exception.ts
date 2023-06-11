export default class UnexceptedClientException extends Error {
  constructor() {
    super("Unexcepted OpenProjectClient error happened.");
  }
}
