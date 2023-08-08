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
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import { OAuthResult } from '../oauth';

/** @internal */
export function adaptOAuthSignInResolverToLegacy<
  TKeys extends string,
>(resolvers: {
  [key in TKeys]: SignInResolver<OAuthAuthenticatorResult<PassportProfile>>;
}): { [key in TKeys]: () => SignInResolver<OAuthResult> } {
  const legacyResolvers = {} as {
    [key in TKeys]: () => SignInResolver<OAuthResult>;
  };
  for (const name of Object.keys(resolvers) as TKeys[]) {
    const resolver = resolvers[name];
    legacyResolvers[name] = () => async (input, ctx) =>
      resolver(
        {
          profile: input.profile,
          result: {
            fullProfile: input.result.fullProfile,
            session: {
              accessToken: input.result.accessToken,
              expiresInSeconds: input.result.params.expires_in,
              scope: input.result.params.scope,
              idToken: input.result.params.id_token,
              tokenType: input.result.params.token_type ?? 'bearer',
              refreshToken: input.result.refreshToken,
            },
          },
        },
        ctx,
      );
  }
  return legacyResolvers;
}
