/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createApiRef } from '../ApiRef';

/**
 * This file contains declarations for common interfaces of auth-related APIs.
 * The declarations should be used to signal which type of authentication and
 * authorization methods each separate auth provider supports.
 *
 * For example, a Google OAuth provider that supports OAuth 2 and OpenID Connect,
 * would be declared as follows:
 *
 * const googleAuthApiRef = createApiRef<OAuthApi & OpenIDConnectApi>({ ... })
 */

/**
 * An array of scopes, or a scope string formatted according to the
 * auth provider, which is typically a space separated list.
 *
 * See the documentation for each auth provider for the list of scopes
 * supported by each provider.
 */
export type OAuthScope = string | string[];

export type AccessTokenOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty access token will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in with a set of scopes,
   * or if you don't want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
};

/**
 * This API provides access to OAuth 2 credentials. It lets you request access tokens,
 * which can be used to act on behalf of the user when talking to APIs.
 */
export type OAuthApi = {
  /**
   * Requests an OAuth 2 Access Token, optionally with a set of scopes. The access token allows
   * you to make requests on behalf of the user, and the copes may grant you broader access, depending
   * on the auth provider.
   *
   * Each auth provider has separate handling of scope, so you need to look at the documentation
   * for each one to know what scope you need to request.
   *
   * This method is cheap and should be called each time an access token is used. Do not for example
   * store the access token in React component state, as that could cause the token to expire. Instead
   * fetch a new access token for each request.
   *
   * Be sure to include all required scopes when requesting an access token. When testing your implementation
   * it is best to log out the Backstage session and then visit your plugin page directly, as
   * you might already have some required scopes in your existing session. Not requesting the correct
   * scopes can lead to 403 or other authorization errors, which can be tricky to debug.
   *
   * If the user has not yet granted access to the provider and the set of requested scopes, the user
   * will be prompted to log in. The returned promise will not resolve until the user has
   * successfully logged in. The returned promise can be rejected, but only if the user rejects the login request.
   */
  getAccessToken(
    scope?: OAuthScope,
    options?: AccessTokenOptions,
  ): Promise<string>;

  /**
   * Log out the user's session. This will reload the page.
   */
  logout(): Promise<void>;
};

export type IdTokenOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty id token will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
};

/**
 * This API provides access to OpenID Connect credentials. It lets you request ID tokens,
 * which can be passed to backend services to prove the user's identity.
 */
export type OpenIdConnectApi = {
  /**
   * Requests an OpenID Connect ID Token.
   *
   * This method is cheap and should be called each time an ID token is used. Do not for example
   * store the id token in React component state, as that could cause the token to expire. Instead
   * fetch a new id token for each request.
   *
   * If the user has not yet logged in to Google inside Backstage, the user will be prompted
   * to log in. The returned promise will not resolve until the user has successfully logged in.
   * The returned promise can be rejected, but only if the user rejects the login request.
   */
  getIdToken(options?: IdTokenOptions): Promise<string>;

  /**
   * Log out the user's session. This will reload the page.
   */
  logout(): Promise<void>;
};

export type ProfileInfoOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty profile will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;
};

export type ProfileInfoApi = {
  getProfile(options?: ProfileInfoOptions): Promise<ProfileInfo | undefined>;
};

export type ProfileInfo = {
  provider: string;
  email: string;
  name?: string;
  picture?: string;
};

/**
 * Provides authentication towards Google APIs and identities.
 *
 * See https://developers.google.com/identity/protocols/googlescopes for a full list of supported scopes.
 *
 * Note that the ID token payload is only guaranteed to contain the user's numerical Google ID,
 * email and expiration information. Do not rely on any other fields, as they might not be present.
 */
export const googleAuthApiRef = createApiRef<
  OAuthApi & OpenIdConnectApi & ProfileInfoApi
>({
  id: 'core.auth.google',
  description: 'Provides authentication towards Google APIs and identities',
});

/**
 * Provides authentication towards Github APIs.
 *
 * See https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
 * for a full list of supported scopes.
 */
export const githubAuthApiRef = createApiRef<OAuthApi>({
  id: 'core.auth.github',
  description: 'Provides authentication towards Github APIs',
});
