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
  PassportOAuthAuthenticatorHelper,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { githubAuthenticator } from './authenticator';

describe('githubAuthenticator', () => {
  it('should store access token without expiration as refresh token', async () => {
    await expect(
      githubAuthenticator.authenticate(
        {} as any,
        {
          authenticate: async _input => ({
            fullProfile: { id: 'id' } as PassportProfile,
            session: {
              accessToken: 'my-token',
              scope: 'user:read',
              tokenType: 'bearer',
            },
          }),
        } as PassportOAuthAuthenticatorHelper,
      ),
    ).resolves.toEqual({
      fullProfile: { id: 'id' },
      session: {
        accessToken: 'my-token',
        scope: 'user:read',
        tokenType: 'bearer',
        refreshToken: 'access-token.my-token',
      },
    });
  });

  it('should not use access token as refresh token if it expires', async () => {
    await expect(
      githubAuthenticator.authenticate(
        {} as any,
        {
          authenticate: async _input => ({
            fullProfile: { id: 'id' } as PassportProfile,
            session: {
              accessToken: 'my-token',
              scope: 'user:read',
              tokenType: 'bearer',
              expiresInSeconds: 3,
            },
          }),
        } as PassportOAuthAuthenticatorHelper,
      ),
    ).resolves.toEqual({
      fullProfile: { id: 'id' },
      session: {
        accessToken: 'my-token',
        scope: 'user:read',
        tokenType: 'bearer',
        expiresInSeconds: 3,
      },
    });
  });

  it('should not store access token without expiration if a refresh token is provided', async () => {
    await expect(
      githubAuthenticator.authenticate(
        {} as any,
        {
          authenticate: async _input => ({
            fullProfile: { id: 'id' } as PassportProfile,
            session: {
              accessToken: 'my-token',
              scope: 'user:read',
              tokenType: 'bearer',
              refreshToken: 'my-refresh-token',
            },
          }),
        } as PassportOAuthAuthenticatorHelper,
      ),
    ).resolves.toEqual({
      fullProfile: { id: 'id' },
      session: {
        accessToken: 'my-token',
        scope: 'user:read',
        tokenType: 'bearer',
        refreshToken: 'my-refresh-token',
      },
    });
  });

  it('should refresh with access token', async () => {
    await expect(
      githubAuthenticator.refresh(
        {
          refreshToken: 'access-token.my-token',
          req: {} as any,
          scope: 'user:read',
        },
        {
          fetchProfile: async _input => ({ id: 'id' }) as PassportProfile,
        } as PassportOAuthAuthenticatorHelper,
      ),
    ).resolves.toEqual({
      fullProfile: { id: 'id' },
      session: {
        accessToken: 'my-token',
        scope: 'user:read',
        tokenType: 'bearer',
        refreshToken: 'access-token.my-token',
      },
    });
  });

  it('should refresh with refresh token', async () => {
    const res = {};
    await expect(
      githubAuthenticator.refresh(
        {
          refreshToken: 'my-refresh-token',
          req: {} as any,
          scope: 'user:read',
        },
        {
          refresh: async _input => res as any,
        } as PassportOAuthAuthenticatorHelper,
      ),
    ).resolves.toBe(res);
  });
});
