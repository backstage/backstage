/*
 * Copyright 2022 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';
import { Request, Response } from 'express';

/**
 * A representation of a successful Backstage sign-in.
 *
 * Compared to the {@link BackstageIdentityResponse} this type omits
 * the decoded identity information embedded in the token.
 *
 * @public
 */
export interface BackstageSignInResult {
  /**
   * The token used to authenticate the user within Backstage.
   */
  token: string;
}

/**
 * Response object containing the {@link BackstageUserIdentity} and the token
 * from the authentication provider.
 *
 * @public
 */
export interface BackstageIdentityResponse extends BackstageSignInResult {
  /**
   * The number of seconds until the token expires. If not set, it can be assumed that the token does not expire.
   */
  expiresInSeconds?: number;

  /**
   * A plaintext description of the identity that is encapsulated within the token.
   */
  identity: BackstageUserIdentity;
}

/**
 * User identity information within Backstage.
 *
 * @public
 */
export type BackstageUserIdentity = {
  /**
   * The type of identity that this structure represents. In the frontend app
   * this will currently always be 'user'.
   */
  type: 'user';

  /**
   * The entityRef of the user in the catalog.
   * For example User:default/sandra
   */
  userEntityRef: string;

  /**
   * The user and group entities that the user claims ownership through
   */
  ownershipEntityRefs: string[];
};

/**
 * A query for a single user in the catalog.
 *
 * If `entityRef` is used, the default kind is `'User'`.
 *
 * If `annotations` are used, all annotations must be present and
 * match the provided value exactly. Only entities of kind `'User'` will be considered.
 *
 * If `filter` are used, only entities of kind `'User'` will be considered unless it is explicitly specified differently in the filter.
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
      filter: EntityFilterQuery;
    };

/**
 * Parameters used to issue new Backstage Tokens
 *
 * @public
 */
export type TokenParams = {
  /**
   * The claims that will be embedded within the token. At a minimum, this should include
   * the subject claim, `sub`. It is common to also list entity ownership relations in the
   * `ent` list. Additional claims may also be added at the developer's discretion except
   * for the following list, which will be overwritten by the TokenIssuer: `iss`, `aud`,
   * `iat`, and `exp`. The Backstage team also maintains the right add new claims in the future
   * without listing the change as a "breaking change".
   */
  claims: {
    /** The token subject, i.e. User ID */
    sub: string;
    /** A list of entity references that the user claims ownership through */
    ent?: string[];
  } & Record<string, JsonValue>;
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

  /**
   * Resolves the ownership entity references for the provided entity.
   * This will use the `AuthOwnershipResolver` if one is installed, and otherwise fall back to the default resolution logic.
   */
  resolveOwnershipEntityRefs(
    entity: Entity,
  ): Promise<{ ownershipEntityRefs: string[] }>;
};

/**
 * Resolver interface for resolving the ownership entity references for entity
 *
 * @public
 */
export interface AuthOwnershipResolver {
  resolveOwnershipEntityRefs(
    entity: Entity,
  ): Promise<{ ownershipEntityRefs: string[] }>;
}

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
 *
 * @public
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
  start(req: Request, res: Response): Promise<void>;

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
  frameHandler(req: Request, res: Response): Promise<void>;

  /**
   * (Optional) If the auth provider supports refresh tokens then this method handles
   * requests to get a new access token.
   *
   * Other types of providers may also use this method to implement its own logic to create new sessions
   * upon request. For example, this can be used to create a new session for a provider that handles requests
   * from an authenticating proxy.
   *
   * Request
   * - to contain a refresh token cookie and scope (Optional) query parameter.
   * Response
   * - payload with accessToken, expiryInSeconds?, idToken?, scope and user profile information.
   */
  refresh?(req: Request, res: Response): Promise<void>;

  /**
   * (Optional) Handles sign out requests
   *
   * Response
   * - removes the refresh token cookie
   */
  logout?(req: Request, res: Response): Promise<void>;
}

/**
 * @public
 * @deprecated Use top-level properties passed to `AuthProviderFactory` instead
 */
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

/** @public */
export type AuthProviderFactory = (options: {
  providerId: string;
  /** @deprecated Use top-level properties instead */
  globalConfig: AuthProviderConfig;
  config: Config;
  logger: LoggerService;
  resolverContext: AuthResolverContext;
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
}) => AuthProviderRouteHandlers;

/** @public */
export type ClientAuthResponse<TProviderInfo> = {
  providerInfo: TProviderInfo;
  profile: ProfileInfo;
  backstageIdentity?: BackstageIdentityResponse;
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
 * Describes the function that transforms the result of a successful
 * authentication into a {@link ProfileInfo} object.
 *
 * This function may optionally throw an error in order to reject authentication.
 *
 * @public
 */
export type ProfileTransform<TResult> = (
  result: TResult,
  context: AuthResolverContext,
) => Promise<{ profile: ProfileInfo }>;

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
  /** The origin URL of the app */
  appOrigin: string;
}) => {
  domain: string;
  path: string;
  secure: boolean;
  sameSite?: 'none' | 'lax' | 'strict';
};

/**
 * Core properties of various token types.
 *
 * @public
 */
export const tokenTypes = Object.freeze({
  user: Object.freeze({
    typParam: 'vnd.backstage.user',
    audClaim: 'backstage',
  }),
  limitedUser: Object.freeze({
    typParam: 'vnd.backstage.limited-user',
  }),
  plugin: Object.freeze({
    typParam: 'vnd.backstage.plugin',
  }),
});
