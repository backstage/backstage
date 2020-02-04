import GoogleScopes from './GoogleScopes';

/**
 * This api provides access to Google OAuth credentials. It lets you request access tokens,
 * which can be used to act on behalf of the user when talking to Google APIs. It also supplies
 * ID Tokens, which can be passed to backend services to prove the user's identity.
 *
 * The API can be called directly to get access and ID tokens, which will cause a modal dialog
 * to show up if the user is not yet signed in.
 *
 * For more fine grained control of where the sign in prompt is shown, it is possible to use
 * the GoogleAuthBarrier components, which ensures that all components rendered inside it
 * have synchronous access to both access and ID tokens.
 *
 * For full examples, see https://backstage.spotify.net/docs/backstage-frontend/apis/#google-auth-api
 */
export type GoogleAuthApi = {
  /**
   * Requests a Google OAuth ID Token, optionally with a set of scopes. The scopes allow you to access
   * google APIs on behalf of the user. A full list of scopes can be found at https://developers.google.com/identity/protocols/googlescopes.
   *
   * Be sure to include all required scopes when requesting an access token. When testing your implementation
   * it is best to log out the Backstage Google session and then visit your plugin page directly, as
   * you might already have some required scopes in your existing session. Not requesting the correct
   * scopes can lead to 403 or other authorization errors, which can be tricky to debug.
   *
   * This method is cheap and should be called each time an access token is used. Do not for example
   * store the access token in React component state, as that could cause the token to expire. Instead
   * fetch a new access token for each request.
   *
   * If the user has not yet logged in to Google inside Backstage, a dialog window will be shown
   * that prompts the user to log in, and the returned promise will not resolve until the user has
   * successfully logged in.
   *
   * The returned promise can be rejected, but only if the user rejects the login request. If the
   * login fails because the user fails to log in to their google account, the dialog will simply
   * remain and ask them to try again, and the promise will still be pending.
   */
  getAccessToken(scope?: string | string[]): Promise<string>;

  /**
   * Requests a Google OAuth ID Token.
   *
   * Note that the ID token payload is only guaranteed to contain the user's numerical Google ID,
   * email and expiration information. Do not rely on any other fields, as they might not be present.
   *
   * This method is cheap and should be called each time an ID token is used. Do not for example
   * store the id token in React component state, as that could cause the token to expire. Instead
   * fetch a new id token for each request.
   *
   * If the user has not yet logged in to Google inside Backstage, a dialog window will be shown
   * that prompts the user to log in, and the returned promise will not resolve until the user has
   * successfully logged in.
   *
   * The returned promise can be rejected, but only if the user rejects the login request. If the
   * login fails because the user fails to log in to their google account, the dialog will simply
   * remain and ask them to try again, and the promise will still be pending.
   */
  getIdToken(options?: IdTokenOptions): Promise<string>;

  /**
   * Logs out the user's Google session. This will reload the page.
   */
  logout(): Promise<void>;
};

export type GoogleSession = {
  idToken: string;
  accessToken: string;
  scopes: GoogleScopes;
  expiresAt: Date;
};

export type IdTokenOptions = {
  // If this is set to true, the user will not be prompted to log in,
  // and an empty id token will be returned if there is no existing session.
  optional?: boolean;
};
