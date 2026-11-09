/*
 * Copyright 2026 The Backstage Authors
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

import type { CliCommandContext } from '@backstage/cli-node';
import { httpJson } from '../lib/http';
import logout from './logout';

const mockRemoveInstance = jest.fn();
jest.mock('../lib/storage', () => ({
  getInstanceByName: jest.fn().mockResolvedValue({
    name: 'test-instance',
    baseUrl: 'https://backstage.example.com',
    clientId:
      'https://backstage.example.com/api/auth/.well-known/oauth-client/cli.json',
    issuedAt: 0,
    accessTokenExpiresAt: 0,
  }),
  removeInstance: (...args: any[]) => mockRemoveInstance(...args),
  withMetadataLock: (fn: Function) => fn(),
}));

const mockSecretStoreDelete = jest.fn();
jest.mock('@internal/cli', () => ({
  getSecretStore: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue('test-refresh-token'),
    delete: (...args: any[]) => mockSecretStoreDelete(...args),
  }),
  getAuthInstanceService: jest.fn().mockReturnValue('test-service'),
}));

jest.mock('../lib/prompt', () => ({
  pickInstance: jest.fn().mockResolvedValue({ name: 'test-instance' }),
}));

jest.mock('../lib/http', () => ({
  httpJson: jest.fn().mockResolvedValue(undefined),
}));

describe('logout', () => {
  it('revokes the refresh token as the CLI client and removes local state', async () => {
    await logout({
      args: [],
      info: { usage: 'backstage-cli auth logout', name: 'logout' },
    } as unknown as CliCommandContext);

    expect(httpJson).toHaveBeenCalledWith(
      'https://backstage.example.com/api/auth/v1/revoke',
      expect.objectContaining({
        method: 'POST',
        body: {
          token: 'test-refresh-token',
          token_type_hint: 'refresh_token',
          client_id:
            'https://backstage.example.com/api/auth/.well-known/oauth-client/cli.json',
        },
      }),
    );
    expect(mockSecretStoreDelete).toHaveBeenCalledWith(
      'test-service',
      'accessToken',
    );
    expect(mockSecretStoreDelete).toHaveBeenCalledWith(
      'test-service',
      'refreshToken',
    );
    expect(mockRemoveInstance).toHaveBeenCalledWith('test-instance');
  });
});
