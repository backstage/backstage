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

import type { ConnectionsService } from '@backstage/connections';
import {
  GithubIntegrationConfig,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import { createGithubCredentialsProvider } from './createGithubCredentialsProvider';

jest.mock('@backstage/integration', () => ({
  ...jest.requireActual('@backstage/integration'),
  SingleInstanceGithubCredentialsProvider: {
    create: jest.fn(),
  },
}));

describe('createGithubCredentialsProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (
      SingleInstanceGithubCredentialsProvider.create as jest.MockedFunction<
        typeof SingleInstanceGithubCredentialsProvider.create
      >
    ).mockImplementation((config: GithubIntegrationConfig) => ({
      getCredentials: async () => ({
        type: 'token',
        token: `${config.host}-token`,
      }),
    }));
  });

  it('creates and reuses providers for GitHub App connections', async () => {
    const find = jest.fn().mockResolvedValue({
      type: 'github',
      title: 'GitHub',
      host: 'github.com',
      apiBaseUrl: 'https://api.github.com',
      rawBaseUrl: 'https://raw.githubusercontent.com',
      auth: {
        method: 'app',
        appId: '123',
        privateKey: 'private-key',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        webhookSecret: 'webhook-secret',
        publicAccess: true,
        orgs: ['backstage'],
      },
    });
    const provider = createGithubCredentialsProvider({
      find: find as ConnectionsService['find'],
    });

    await provider.getCredentials({
      url: 'https://github.com/backstage/backstage',
    });
    await provider.getCredentials({
      url: 'https://github.com/backstage/community',
    });

    expect(find).toHaveBeenCalledWith({
      type: 'github',
      url: 'https://github.com/backstage/backstage',
      authMethods: ['app', 'token', 'none'],
    });
    expect(
      SingleInstanceGithubCredentialsProvider.create,
    ).toHaveBeenCalledTimes(1);
    expect(SingleInstanceGithubCredentialsProvider.create).toHaveBeenCalledWith(
      {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
        apps: [
          {
            appId: 123,
            privateKey: 'private-key',
            clientId: 'client-id',
            clientSecret: 'client-secret',
            webhookSecret: 'webhook-secret',
            publicAccess: true,
            allowedInstallationOwners: ['backstage'],
          },
        ],
      },
    );
  });

  it('creates token providers from token connections', async () => {
    const find = jest.fn().mockResolvedValue({
      type: 'github',
      title: 'GitHub Enterprise',
      host: 'github.example.com',
      auth: {
        method: 'token',
        token: 'connection-token',
      },
    });
    const provider = createGithubCredentialsProvider({
      find: find as ConnectionsService['find'],
    });

    await provider.getCredentials({
      url: 'https://github.example.com/backstage/backstage',
    });

    expect(SingleInstanceGithubCredentialsProvider.create).toHaveBeenCalledWith(
      {
        host: 'github.example.com',
        apiBaseUrl: undefined,
        rawBaseUrl: undefined,
        token: 'connection-token',
      },
    );
  });
});
