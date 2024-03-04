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
  AuthProviderConfig as _AuthProviderConfig,
  AuthProviderRouteHandlers as _AuthProviderRouteHandlers,
  AuthProviderFactory as _AuthProviderFactory,
  AuthResolverCatalogUserQuery as _AuthResolverCatalogUserQuery,
  AuthResolverContext as _AuthResolverContext,
  ClientAuthResponse as _ClientAuthResponse,
  CookieConfigurer as _CookieConfigurer,
  ProfileInfo as _ProfileInfo,
  SignInInfo as _SignInInfo,
  SignInResolver as _SignInResolver,
} from '@backstage/plugin-auth-node';
import { OAuthStartRequest } from '../lib/oauth/types';

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type AuthResolverCatalogUserQuery = _AuthResolverCatalogUserQuery;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type AuthResolverContext = _AuthResolverContext;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type CookieConfigurer = _CookieConfigurer;

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
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type AuthProviderConfig = _AuthProviderConfig;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type AuthProviderRouteHandlers = _AuthProviderRouteHandlers;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type AuthProviderFactory = _AuthProviderFactory;

/**
 * @public
 * @deprecated import `ClientAuthResponse` from `@backstage/plugin-auth-node` instead
 */
export type AuthResponse<TProviderInfo> = _ClientAuthResponse<TProviderInfo>;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type ProfileInfo = _ProfileInfo;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type SignInInfo<TAuthResult> = _SignInInfo<TAuthResult>;

/**
 * @public
 * @deprecated import from `@backstage/plugin-auth-node` instead
 */
export type SignInResolver<TAuthResult> = _SignInResolver<TAuthResult>;

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

/**
 * @public
 * @deprecated Use `createOAuthRouteHandlers` from `@backstage/plugin-auth-node` instead
 */
export type StateEncoder = (
  req: OAuthStartRequest,
) => Promise<{ encodedState: string }>;
