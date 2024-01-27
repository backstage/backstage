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

import { SignInResolverFactory } from '@backstage/plugin-auth-node';
import type {
  AuthProviderFactory,
  ProfileTransform,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import { createGuestAuthRouteHandlers } from './createGuestAuthRouteHandlers';
import { guestResolver } from './resolvers';

const defaultTransform: ProfileTransform<{}> = async () => {
  return {
    profile: {
      displayName: 'Guest',
    },
  };
};

/** @public */
export function createGuestAuthProviderFactory(options?: {
  profileTransform?: ProfileTransform<{}>;
  signInResolver?: SignInResolver<{}>;
  signInResolverFactories?: Record<string, SignInResolverFactory<{}, unknown>>;
}): AuthProviderFactory {
  return ctx => {
    const signInResolver = options?.signInResolver ?? guestResolver();

    if (!signInResolver) {
      throw new Error(
        `No sign-in resolver configured for guest auth provider '${ctx.providerId}'`,
      );
    }
    const profileTransform = options?.profileTransform ?? defaultTransform;

    return createGuestAuthRouteHandlers({
      signInResolver,
      baseUrl: ctx.baseUrl,
      appUrl: ctx.appUrl,
      config: ctx.config,
      resolverContext: ctx.resolverContext,
      profileTransform,
    });
  };
}
