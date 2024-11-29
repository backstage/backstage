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
  AuthResolverContext,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { adaptLegacyOAuthSignInResolver } from './adaptLegacyOAuthSignInResolver';

describe('adaptLegacyOAuthSignInResolver', () => {
  it('should pass through undefined', () => {
    expect(adaptLegacyOAuthSignInResolver(undefined)).toBeUndefined();
  });

  it('should convert a legacy resolver to a new one', () => {
    const legacyResolver = jest.fn();

    const newResolver = adaptLegacyOAuthSignInResolver(legacyResolver);

    newResolver?.(
      {
        profile: { email: 'em@i.l' },
        result: {
          fullProfile: { id: 'id' } as PassportProfile,
          session: {
            accessToken: 'token',
            expiresInSeconds: 3,
            scope: 'sco pe',
            tokenType: 'bear',
            idToken: 'id-token',
            refreshToken: 'refresh-token',
          },
        },
      },
      { ctx: 'ctx' } as unknown as AuthResolverContext,
    );

    expect(legacyResolver).toHaveBeenCalledWith(
      {
        profile: { email: 'em@i.l' },
        result: {
          fullProfile: { id: 'id' },
          accessToken: 'token',
          refreshToken: 'refresh-token',
          params: {
            scope: 'sco pe',
            id_token: 'id-token',
            expires_in: 3,
            token_type: 'bear',
          },
        },
      },
      { ctx: 'ctx' },
    );
  });
});
