/**
 * makes http://username:password@google.com out of http://google.com
 * @param url url to which we want to add token
 * @param username username to add
 * @param password password to add
 * @returns url with creds
 */
export default function addCredsToUrl(
  url: string,
  username: string,
  password: string,
): string {
  const parsedUrl = new URL(url);
  parsedUrl.username = username;
  parsedUrl.password = password;
  return parsedUrl.toString();
}
