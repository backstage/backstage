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

import express from 'express';
import { Logger } from 'winston';

export type OAuthProviderOptions = {
  /**
   * Client ID of the auth provider.
   */
  clientID: string;
  /**
   * Client Secret of the auth provider.
   */
  clientSecret: string;
  /**
   * Callback URL to be passed to the auth provider to redirect to after the user signs in.
   */
  callbackURL: string;
};

export type OAuthProviderConfig = {
  /**
   * If the cookies set by the provider have to be marked secure. For development environment
   * we don't mark the cookie as secure.
   */
  secure: boolean;
  /**
   * The domain:port where the app (frontend) is hosted. This is used to post messages back
   * to the window that initiates an auth request.
   */
  appOrigin: string;
  /**
   * Client ID of the auth provider.
   */
  clientId: string;
  /**
   * Client Secret of the auth provider.
   */
  clientSecret: string;
};

export type EnvironmentProviderConfig = {
  /**
   * key, values are environment names and OAuthProviderConfigs
   *
   * For e.g
   * {
   *   development: DevelopmentOAuthProviderConfig
   *   production: ProductionOAuthProviderConfig
   * }
   */
  [key: string]: OAuthProviderConfig;
};

export type AuthProviderConfig = {
  /**
   * The domain:port where the app is hosted. This is used to construct the
   * callbackURL to redirect to once the user signs in to the auth provider.
   */
  baseUrl: string;
};

/**
 * Any OAuth provider needs to implement this interface which has provider specific
 * handlers for different methods to perform authentication, get access tokens,
 * refresh tokens and perform sign out.
 */
export interface OAuthProviderHandlers {
  /**
   * This method initiates a sign in request with an auth provider.
   * @param {express.Request} req
   * @param options
   */
  start(req: express.Request, options: any): Promise<any>;

  /**
   * Handles the redirect from the auth provider when the user has signed in.
   * @param {express.Request} req
   */
  handler(req: express.Request): Promise<any>;

  /**
   * (Optional) Given a refresh token and scope fetches a new access token from the auth provider.
   * @param {string} refreshToken
   * @param {string} scope
   */
  refresh?(refreshToken: string, scope: string): Promise<any>;

  /**
   * (Optional) Sign out of the auth provider.
   */
  logout?(): Promise<any>;
}

/**
 * Any Auth provider needs to implement this interface which handles the routes in the
 * auth backend. Any auth API requests from the frontend reaches these methods.
 *
 * The routes in the auth backend API are tied to these methods like below
 *
 * /auth/[provider]/start -> start
 * /auth/[provider]/handler/frame -> frameHandler
 * /auth/[provider]/refresh -> refresh
 * /auth/[provider]/logout -> logout
 */
export interface AuthProviderRouteHandlers {
  /**
   * Handles the start route of the API. This initiates a sign in request with an auth provider.
   *
   * Request
   * - scopes for the auth request (Optional)
   * Response
   * - redirect to the auth provider for the user to sign in or consent.
   * - sets a nonce cookie and also pass the nonce as 'state' query parameter in the redirect request
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  start(req: express.Request, res: express.Response): Promise<any>;

  /**
   * Once the user signs in or consents in the OAuth screen, the auth provider redirects to the
   * callbackURL which is handled by this method.
   *
   * Request
   * - to contain a nonce cookie and a 'state' query parameter
   * Response
   * - postMessage to the window with a payload that contains accessToken, expiryInSeconds?, idToken? and scope.
   * - sets a refresh token cookie if the auth provider supports refresh tokens
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  frameHandler(req: express.Request, res: express.Response): Promise<any>;

  /**
   * (Optional) If the auth provider supports refresh tokens then this method handles
   * requests to get a new access token.
   *
   * Request
   * - to contain a refresh token cookie and scope (Optional) query parameter.
   * Response
   * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  refresh?(req: express.Request, res: express.Response): Promise<any>;

  /**
   * (Optional) Handles sign out requests
   *
   * Response
   * - removes the refresh token cookie
   *
   * @param {express.Request} req
   * @param {express.Response} res
   */
  logout?(req: express.Request, res: express.Response): Promise<any>;
}

export type AuthProviderFactory = (
  globalConfig: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
) => AuthProviderRouteHandlers;

export type AuthInfoBase = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * (Optional) Id token issued for the signed in user.
   */
  idToken?: string;
  /**
   * Expiry of the access token in seconds.
   */
  expiresInSeconds?: number;
  /**
   * Scopes granted for the access token.
   */
  scope: string;
};

export type AuthInfoWithProfile = AuthInfoBase & {
  /**
   * Profile information of the signed in user.
   */
  profile: ProfileInfo | undefined;
};

export type AuthInfoPrivate = {
  /**
   * A refresh token issued for the signed in user.
   */
  refreshToken: string;
};

/**
 * Payload sent as a post message after the auth request is complete.
 * If successful then has a valid payload with Auth information else contains an error.
 */
export type AuthResponse =
  | {
      type: 'auth-result';
      payload: AuthInfoBase | AuthInfoWithProfile;
    }
  | {
      type: 'auth-result';
      error: Error;
    };

export type RedirectInfo = {
  /**
   * URL to redirect to
   */
  url: string;
  /**
   * Status code to use for the redirect
   */
  status?: number;
};

export type ProfileInfo = {
  /**
   * Email ID of the signed in user.
   */
  email: string;
  /**
   * Display name that can be presented to the signed in user.
   */
  name: string;
  /**
   * URL to an image that can be used as the display image or avatar of the
   * signed in user.
   */
  picture: string;
};

export type RefreshTokenResponse = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  params: any;
};

export type SAMLProviderConfig = {
  entryPoint: string;
  issuer: string;
};

export type SAMLEnvironmentProviderConfig = {
  [key: string]: SAMLProviderConfig;
};
