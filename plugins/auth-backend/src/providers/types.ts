/*
 * Copyright 2020 The Backstage Authors
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

import { GetEntitiesRequest } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  BackstageIdentityResponse,
  BackstageSignInResult,
} from '@backstage/plugin-auth-node';
import express from 'express';
import { Logger } from 'winston';
import { TokenParams } from '../identity/types';
import { OAuthStartRequest } from '../lib/oauth/types';

/**
 * A query for a single user in the catalog.
 *
 * If `entityRef` is used, the default kind is `'User'`.
 *
 * If `annotations` are used, all annotations must be present and
 * match the provided value exactly. Only entities of kind `'User'` will be considered.
 *
 * If `filter` are used they are passed on as they are to the `CatalogApi`.
 *
 * Regardless of the query method, the query must match exactly one entity
 * in the catalog, or an error will be thrown.
 *
 * @public
 */
export type AuthResolverCatalogUserQuery =
  | {
      entityRef:
        | string
        | {
            kind?: string;
            namespace?: string;
            name: string;
          };
    }
  | {
      annotations: Record<string, string>;
    }
  | {
      filter: Exclude<GetEntitiesRequest['filter'], undefined>;
    };

/**
 * The context that is used for auth processing.
 *
 * @public
 */
export type AuthResolverContext = {
  /**
   * Issues a Backstage token using the provided parameters.
   */
  issueToken(params: TokenParams): Promise<{ token: string }>;

  /**
   * Finds a single user in the catalog using the provided query.
   *
   * See {@link AuthResolverCatalogUserQuery} for details.
   */
  findCatalogUser(
    query: AuthResolverCatalogUserQuery,
  ): Promise<{ entity: Entity }>;

  /**
   * Finds a single user in the catalog using the provided query, and then
   * issues an identity for that user using default ownership resolution.
   *
   * See {@link AuthResolverCatalogUserQuery} for details.
   */
  signInWithCatalogUser(
    query: AuthResolverCatalogUserQuery,
  ): Promise<BackstageSignInResult>;
};

/**
 * The callback used to resolve the cookie configuration for auth providers that use cookies.
 * @public
 */
export type CookieConfigurer = (ctx: {
  /** ID of the auth provider that this configuration applies to */
  providerId: string;
  /** The externally reachable base URL of the auth-backend plugin */
  baseUrl: string;
  /** The configured callback URL of the auth provider */
  callbackUrl: string;
}) => { domain: string; path: string; secure: boolean };

/** @public */
export type AuthProviderConfig = {
  /**
   * The protocol://domain[:port] where the app is hosted. This is used to construct the
   * callbackURL to redirect to once the user signs in to the auth provider.
   */
  baseUrl: string;

  /**
   * The base URL of the app as provided by app.baseUrl
   */
  appUrl: string;

  /**
   * A function that is called to check whether an origin is allowed to receive the authentication result.
   */
  isOriginAllowed: (origin: string) => boolean;

  /**
   * The function used to resolve cookie configuration based on the auth provider options.
   */
  cookieConfigurer?: CookieConfigurer;
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

/**
 * Any Auth provider needs to implement this interface which handles the routes in the
 * auth backend. Any auth API requests from the frontend reaches these methods.
 *
 * The routes in the auth backend API are tied to these methods like below
 *
 * `/auth/[provider]/start -> start`
 * `/auth/[provider]/handler/frame -> frameHandler`
 * `/auth/[provider]/refresh -> refresh`
 * `/auth/[provider]/logout -> logout`
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
   */
  start(req: express.Request, res: express.Response): Promise<void>;

  /**
   * Once the user signs in or consents in the OAuth screen, the auth provider redirects to the
   * callbackURL which is handled by this method.
   *
   * Request
   * - to contain a nonce cookie and a 'state' query parameter
   * Response
   * - postMessage to the window with a payload that contains accessToken, expiryInSeconds?, idToken? and scope.
   * - sets a refresh token cookie if the auth provider supports refresh tokens
   */
  frameHandler(req: express.Request, res: express.Response): Promise<void>;

  /**
   * (Optional) If the auth provider supports refresh tokens then this method handles
   * requests to get a new access token.
   *
   * Request
   * - to contain a refresh token cookie and scope (Optional) query parameter.
   * Response
   * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
   */
  refresh?(req: express.Request, res: express.Response): Promise<void>;

  /**
   * (Optional) Handles sign out requests
   *
   * Response
   * - removes the refresh token cookie
   */
  logout?(req: express.Request, res: express.Response): Promise<void>;
}

export type AuthProviderFactory = (options: {
  providerId: string;
  globalConfig: AuthProviderConfig;
  config: Config;
  logger: Logger;
  resolverContext: AuthResolverContext;
}) => AuthProviderRouteHandlers;

/** @public */
export type AuthResponse<ProviderInfo> = {
  providerInfo: ProviderInfo;
  profile: ProfileInfo;
  backstageIdentity?: BackstageIdentityResponse;
};

/**
 * Used to display login information to user, i.e. sidebar popup.
 *
 * It is also temporarily used as the profile of the signed-in user's Backstage
 * identity, but we want to replace that with data from identity and/org catalog
 * service
 *
 * @public
 */
export type ProfileInfo = {
  /**
   * Email ID of the signed in user.
   */
  email?: string;
  /**
   * Display name that can be presented to the signed in user.
   */
  displayName?: string;
  /**
   * URL to an image that can be used as the display image or avatar of the
   * signed in user.
   */
  picture?: string;
};

/**
 * Type of sign in information context. Includes the profile information and
 * authentication result which contains auth related information.
 *
 * @public
 */
export type SignInInfo<TAuthResult> = {
  /**
   * The simple profile passed down for use in the frontend.
   */
  profile: ProfileInfo;

  /**
   * The authentication result that was received from the authentication
   * provider.
   */
  result: TAuthResult;
};

/**
 * Describes the function which handles the result of a successful
 * authentication. Must return a valid {@link @backstage/plugin-auth-node#BackstageSignInResult}.
 *
 * @public
 */
export type SignInResolver<TAuthResult> = (
  info: SignInInfo<TAuthResult>,
  context: AuthResolverContext,
) => Promise<BackstageSignInResult>;

/**
 * The return type of an authentication handler. Must contain valid profile
 * information.
 *
 * @public
 */
export type AuthHandlerResult = { profile: ProfileInfo };

/**
 * The AuthHandler function is called every time the user authenticates using
 * the provider.
 *
 * The handler should return a profile that represents the session for the user
 * in the frontend.
 *
 * Throwing an error in the function will cause the authentication to fail,
 * making it possible to use this function as a way to limit access to a certain
 * group of users.
 *
 * @public
 */
export type AuthHandler<TAuthResult> = (
  input: TAuthResult,
  context: AuthResolverContext,
) => Promise<AuthHandlerResult>;

/** @public */
export type StateEncoder = (
  req: OAuthStartRequest,
) => Promise<{ encodedState: string }>;
