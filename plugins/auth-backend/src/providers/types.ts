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

import {
  AuthResolverContext as _AuthResolverContext,
  ProfileInfo as _ProfileInfo,
} from '@backstage/plugin-auth-node';

/**
 * @public
 * @deprecated Use `createOAuthAuthenticator` from `@backstage/plugin-auth-node` instead
 */
export type OAuthStartResponse = {
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
 * The return type of an authentication handler. Must contain valid profile
 * information.
 *
 * @public
 * @deprecated Use `createOAuthRouteHandlers` from `@backstage/plugin-auth-node` instead
 */
export type AuthHandlerResult = { profile: _ProfileInfo };

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
 * @deprecated Use `createOAuthRouteHandlers` from `@backstage/plugin-auth-node` instead
 */
export type AuthHandler<TAuthResult> = (
  input: TAuthResult,
  context: _AuthResolverContext,
) => Promise<AuthHandlerResult>;
