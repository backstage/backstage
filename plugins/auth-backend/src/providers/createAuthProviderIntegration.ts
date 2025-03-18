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
  AuthProviderFactory,
  SignInResolver,
} from '@backstage/plugin-auth-node';

/**
 * Creates a standardized representation of an integration with a third-party
 * auth provider.
 *
 * The returned object facilitates the creation of provider instances, and
 * supplies built-in sign-in resolvers for the specific provider.
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export function createAuthProviderIntegration<
  TCreateOptions extends unknown[],
  TResolvers extends
    | {
        [name in string]: (...args: any[]) => SignInResolver<any>;
      },
>(config: {
  create: (...args: TCreateOptions) => AuthProviderFactory;
  resolvers?: TResolvers;
}): Readonly<{
  create: (...args: TCreateOptions) => AuthProviderFactory;
  // If no resolvers are defined, this receives the type `never`
  resolvers: Readonly<string extends keyof TResolvers ? never : TResolvers>;
}> {
  return Object.freeze({
    ...config,
    resolvers: Object.freeze(config.resolvers ?? ({} as any)),
  });
}
