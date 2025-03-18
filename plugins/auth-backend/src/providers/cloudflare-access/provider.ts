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

import {
  cloudflareAccessSignInResolvers,
  createCloudflareAccessAuthenticator,
} from '@backstage/plugin-auth-backend-module-cloudflare-access-provider';
import {
  SignInResolver,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthHandler } from '../types';
import { CacheService } from '@backstage/backend-plugin-api';

/**
 * CloudflareAccessClaims
 *
 * Can be used in externally provided auth handler or sign in resolver to
 * enrich user profile for sign-in user entity
 *
 * @public
 * @deprecated import from `@backstage/plugin-auth-backend-module-cloudflare-access-provider` instead
 */
export type CloudflareAccessClaims = {
  /**
   * `aud` identifies the application to which the JWT is issued.
   */
  aud: string[];
  /**
   * `email` contains the email address of the authenticated user.
   */
  email: string;
  /**
   * iat and exp are the issuance and expiration timestamps.
   */
  exp: number;
  iat: number;
  /**
   * `nonce` is the session identifier.
   */
  nonce: string;
  /**
   * `identity_nonce` is available in the Application Token and can be used to
   * query all group membership for a given user.
   */
  identity_nonce: string;
  /**
   * `sub` contains the identifier of the authenticated user.
   */
  sub: string;
  /**
   * `iss` the issuer is the application’s Cloudflare Access Domain URL.
   */
  iss: string;
  /**
   * `custom` contains SAML attributes in the Application Token specified by an
   * administrator in the identity provider configuration.
   */
  custom: string;
};

/**
 * CloudflareAccessGroup
 *
 * @public
 * @deprecated import from `@backstage/plugin-auth-backend-module-cloudflare-access-provider` instead
 */
export type CloudflareAccessGroup = {
  /**
   * Group id
   */
  id: string;
  /**
   * Name of group as defined in Cloudflare zero trust dashboard
   */
  name: string;
  /**
   * Access group email address
   */
  email: string;
};

/**
 * CloudflareAccessIdentityProfile
 *
 * Can be used in externally provided auth handler or sign in resolver to
 * enrich user profile for sign-in user entity
 *
 * @public
 * @deprecated import from `@backstage/plugin-auth-backend-module-cloudflare-access-provider` instead
 */
export type CloudflareAccessIdentityProfile = {
  id: string;
  name: string;
  email: string;
  groups: CloudflareAccessGroup[];
};

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-backend-module-cloudflare-access-provider` instead
 */
export type CloudflareAccessResult = {
  claims: CloudflareAccessClaims;
  cfIdentity: CloudflareAccessIdentityProfile;
  expiresInSeconds?: number;
  token: string;
};

/**
 * Auth provider integration for Cloudflare Access auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const cfAccess = createAuthProviderIntegration({
  create(options: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<CloudflareAccessResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<CloudflareAccessResult>;
    };

    /**
     * Cache service object that was configured for the Backstage backend,
     * should be provided via the backend auth plugin.
     */
    cache?: CacheService;
  }) {
    return createProxyAuthProviderFactory({
      authenticator: createCloudflareAccessAuthenticator({
        cache: options.cache,
      }),
      profileTransform: options?.authHandler,
      signInResolver: options?.signIn?.resolver,
      signInResolverFactories: cloudflareAccessSignInResolvers,
    });
  },
  resolvers: cloudflareAccessSignInResolvers,
});
