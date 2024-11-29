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

import {
  readDeclarativeSignInResolver,
  SignInResolverFactory,
} from '../sign-in';
import {
  AuthProviderFactory,
  ProfileTransform,
  SignInResolver,
} from '../types';
import { createProxyAuthRouteHandlers } from './createProxyRouteHandlers';
import { ProxyAuthenticator } from './types';

/** @public */
export function createProxyAuthProviderFactory<TResult>(options: {
  authenticator: ProxyAuthenticator<unknown, TResult, unknown, unknown>;
  profileTransform?: ProfileTransform<TResult>;
  signInResolver?: SignInResolver<TResult>;
  signInResolverFactories?: Record<string, SignInResolverFactory>;
}): AuthProviderFactory {
  return ctx => {
    const signInResolver =
      options.signInResolver ??
      readDeclarativeSignInResolver({
        config: ctx.config,
        signInResolverFactories: options.signInResolverFactories ?? {},
      });

    if (!signInResolver) {
      throw new Error(
        `No sign-in resolver configured for proxy auth provider '${ctx.providerId}'`,
      );
    }

    return createProxyAuthRouteHandlers<TResult>({
      signInResolver,
      config: ctx.config,
      authenticator: options.authenticator,
      resolverContext: ctx.resolverContext,
      profileTransform: options.profileTransform,
    });
  };
}
