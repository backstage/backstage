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

import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { SignInResolver } from '../types';
import { SignInResolverFactory } from './createSignInResolverFactory';

/** @public */
export interface ReadDeclarativeSignInResolverOptions<TAuthResult> {
  config: Config;
  signInResolverFactories: {
    [name in string]: SignInResolverFactory<TAuthResult, unknown>;
  };
}

/** @public */
export function readDeclarativeSignInResolver<TAuthResult>(
  options: ReadDeclarativeSignInResolverOptions<TAuthResult>,
): SignInResolver<TAuthResult> | undefined {
  const resolvers =
    options.config
      .getOptionalConfigArray('signIn.resolvers')
      ?.map(resolverConfig => {
        const resolverName = resolverConfig.getString('resolver');
        if (!Object.hasOwn(options.signInResolverFactories, resolverName)) {
          throw new Error(
            `Sign-in resolver '${resolverName}' is not available`,
          );
        }
        const resolver = options.signInResolverFactories[resolverName];
        const { resolver: _ignored, ...resolverOptions } =
          resolverConfig.get<JsonObject>();

        return resolver(resolverOptions);
      }) ?? [];

  if (resolvers.length === 0) {
    return undefined;
  }

  return async (profile, context) => {
    for (const resolver of resolvers ?? []) {
      try {
        return await resolver(profile, context);
      } catch (error) {
        if (error?.name === 'NotFoundError') {
          continue;
        }
        throw error;
      }
    }

    throw new Error('Failed to sign-in, unable to resolve user identity');
  };
}
