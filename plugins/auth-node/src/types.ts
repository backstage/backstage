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

import { EntityFilterQuery } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { Request } from 'express';

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
 * Options to request the identity from a Backstage backend request
 *
 * @public
 */
export type IdentityApiGetIdentityRequest = {
  request: Request<unknown>;
};

/**
 * Response object containing the {@link BackstageUserIdentity} and the token
 * from the authentication provider.
 *
 * @public
 */
export interface BackstageIdentityResponse extends BackstageSignInResult {
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
      filter: EntityFilterQuery;
    };

/**
 * Parameters used to issue new ID Tokens
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
