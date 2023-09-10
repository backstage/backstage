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
export function adaptLegacyOAuthSignInResolver(
  signInResolver?: SignInResolver<OAuthResult>,
): SignInResolver<OAuthAuthenticatorResult<PassportProfile>> | undefined {
  return (
    signInResolver &&
    (async (input, ctx) =>
      signInResolver(
        {
          profile: input.profile,
          result: {
            fullProfile: input.result.fullProfile,
            accessToken: input.result.session.accessToken,
            refreshToken: input.result.session.refreshToken,
            params: {
              scope: input.result.session.scope,
              id_token: input.result.session.idToken,
              token_type: input.result.session.tokenType,
              expires_in: input.result.session.expiresInSeconds!,
            },
          },
        },
        ctx,
      ))
  );
}
