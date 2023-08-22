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
  ProfileTransform,
} from '@backstage/plugin-auth-node';
import { AuthHandler } from '../../providers';
import { OAuthResult } from '../oauth';
import { PassportProfile } from '../passport/types';

/** @internal */
export function adaptLegacyOAuthHandler(
  authHandler?: AuthHandler<OAuthResult>,
): ProfileTransform<OAuthAuthenticatorResult<PassportProfile>> | undefined {
  return (
    authHandler &&
    (async (result, ctx) =>
      authHandler(
        {
          fullProfile: result.fullProfile,
          accessToken: result.session.accessToken,
          params: {
            scope: result.session.scope,
            id_token: result.session.idToken,
            token_type: result.session.tokenType,
            expires_in: result.session.expiresInSeconds!,
          },
        },
        ctx,
      ))
  );
}
