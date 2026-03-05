/*
 * Copyright 2023 The Backstage Authors
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

import { readDeclarativeSignInResolver } from '../sign-in';
import {
  AuthProviderFactory,
  ProfileTransform,
  SignInResolver,
} from '../types';
import { OAuthEnvironmentHandler } from './OAuthEnvironmentHandler';
import { createOAuthRouteHandlers } from './createOAuthRouteHandlers';
import { OAuthStateTransform } from './state';
import { OAuthAuthenticator, OAuthAuthenticatorResult } from './types';
import { SignInResolverFactory } from '../sign-in/createSignInResolverFactory';

/** @public */
export function createOAuthProviderFactory<TProfile>(options: {
  authenticator: OAuthAuthenticator<unknown, TProfile>;
  additionalScopes?: string[];
  stateTransform?: OAuthStateTransform;
  profileTransform?: ProfileTransform<OAuthAuthenticatorResult<TProfile>>;
  signInResolver?: SignInResolver<OAuthAuthenticatorResult<TProfile>>;
  signInResolverFactories?: {
    [name in string]: SignInResolverFactory;
  };
}): AuthProviderFactory {
  return ctx => {
    return OAuthEnvironmentHandler.mapConfig(ctx.config, envConfig => {
      const signInResolver =
        readDeclarativeSignInResolver({
          config: envConfig,
          signInResolverFactories: options.signInResolverFactories ?? {},
        }) ?? options.signInResolver;

      return createOAuthRouteHandlers<TProfile>({
        authenticator: options.authenticator,
        appUrl: ctx.appUrl,
        baseUrl: ctx.baseUrl,
        config: envConfig,
        isOriginAllowed: ctx.isOriginAllowed,
        cookieConfigurer: ctx.cookieConfigurer,
        providerId: ctx.providerId,
        resolverContext: ctx.resolverContext,
        additionalScopes: options.additionalScopes,
        stateTransform: options.stateTransform,
        profileTransform: options.profileTransform,
        signInResolver,
      });
    });
  };
}
