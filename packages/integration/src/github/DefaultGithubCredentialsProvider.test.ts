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

import { ScmIntegrations } from '../ScmIntegrations';
import type { GithubIntegrationConfig } from './config';
import { SingleInstanceGithubCredentialsProvider } from './SingleInstanceGithubCredentialsProvider';

import { DefaultGithubCredentialsProvider } from './DefaultGithubCredentialsProvider';
import { ConfigReader } from '@backstage/config';
import type { GithubCredentials } from './types';
import type { ConnectionsService } from '@backstage/connections';
import { ForwardedError, NotFoundError } from '@backstage/errors';

const resultBuilder = (host: string): GithubCredentials => {
  return {
    type: 'token',
    token: `${host}-token`,
    headers: {
      token: `${host}-token`,
    },
  };
};

jest.mock('./SingleInstanceGithubCredentialsProvider');

let integrations: ScmIntegrations;

describe('DefaultGithubCredentialsProvider tests', () => {
  beforeEach(() => {
    integrations = ScmIntegrations.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            {
              host: 'github.com',
              apps: [
                {
                  appId: 1,
                  privateKey: 'privateKey',
                  webhookSecret: '123',
                  clientId: 'CLIENT_ID',
                  clientSecret: 'CLIENT_SECRET',
                },
              ],
              token: 'hardcoded_token',
            },
            {
              host: 'grithub.com',
              token: 'hardcoded_token',
            },
          ],
        },
      }),
    );
    jest.resetAllMocks();
    SingleInstanceGithubCredentialsProvider.create = (
      config: GithubIntegrationConfig,
    ) => {
      return {
        getCredentials: (_opts: { url: string }) => {
          return Promise.resolve(resultBuilder(config.host));
        },
      };
    };
    jest.spyOn(SingleInstanceGithubCredentialsProvider, 'create');
  });

  describe('.create', () => {
    it('passes the config through to the single provider', () => {
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
      const githubIntegration =
        integrations.github.byHost('github.com')?.config;
      const grithubIntegration =
        integrations.github.byHost('grithub.com')?.config;
      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledWith(githubIntegration);
      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledWith(grithubIntegration);
    });

    it('creates and reuses providers from the connections service', async () => {
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
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
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
      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledWith({
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
      });
    });

    it('creates token providers from the connections service', async () => {
      const find = jest.fn().mockResolvedValue({
        type: 'github',
        title: 'GitHub Enterprise',
        host: 'github.example.com',
        auth: {
          method: 'token',
          token: 'connection-token',
        },
      });
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
          find: find as ConnectionsService['find'],
        });

      await provider.getCredentials({
        url: 'https://github.example.com/backstage/backstage',
      });

      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledWith({
        host: 'github.example.com',
        apiBaseUrl: undefined,
        rawBaseUrl: undefined,
        token: 'connection-token',
      });
    });

    it('rejects invalid GitHub App IDs from the connections service', async () => {
      for (const appId of ['not-a-number', '1.2', '9007199254740992', '0']) {
        const find = jest.fn().mockResolvedValue({
          type: 'github',
          title: 'GitHub',
          host: 'github.com',
          auth: {
            method: 'app',
            appId,
            privateKey: 'private-key',
            clientId: 'client-id',
            clientSecret: 'client-secret',
          },
        });
        const provider =
          DefaultGithubCredentialsProvider.experimentalFromConnections({
            find: find as ConnectionsService['find'],
          });

        await expect(
          provider.getCredentials({
            url: 'https://github.com/backstage/backstage',
          }),
        ).rejects.toThrow(
          `Invalid GitHub App ID "${appId}", expected a positive safe integer`,
        );
      }
      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).not.toHaveBeenCalled();
    });

    it('reuses providers for equivalent GitHub App organization sets', async () => {
      const connection = {
        type: 'github',
        title: 'GitHub',
        host: 'github.com',
        auth: {
          method: 'app',
          appId: '123',
          privateKey: 'private-key',
          clientId: 'client-id',
          clientSecret: 'client-secret',
          orgs: ['Backstage', 'Spotify'],
        },
      };
      const find = jest
        .fn()
        .mockResolvedValueOnce(connection)
        .mockResolvedValueOnce({
          ...connection,
          auth: {
            ...connection.auth,
            orgs: ['spotify', 'backstage'],
          },
        });
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
          find: find as ConnectionsService['find'],
        });

      await provider.getCredentials({
        url: 'https://github.com/backstage/backstage',
      });
      await provider.getCredentials({
        url: 'https://github.com/spotify/backstage',
      });

      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledTimes(1);
      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          apps: [
            expect.objectContaining({
              allowedInstallationOwners: ['backstage', 'spotify'],
            }),
          ],
        }),
      );
    });

    it('does not reuse token providers after credential rotation', async () => {
      const connection = {
        type: 'github',
        title: 'GitHub',
        host: 'github.com',
        auth: {
          method: 'token',
          token: 'first-token',
        },
      };
      const find = jest
        .fn()
        .mockResolvedValueOnce(connection)
        .mockResolvedValueOnce({
          ...connection,
          auth: { method: 'token', token: 'second-token' },
        });
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
          find: find as ConnectionsService['find'],
        });

      await provider.getCredentials({
        url: 'https://github.com/backstage/backstage',
      });
      await provider.getCredentials({
        url: 'https://github.com/backstage/community',
      });

      expect(
        SingleInstanceGithubCredentialsProvider.create,
      ).toHaveBeenCalledTimes(2);
    });

    it('reports how to configure a missing GitHub connection', async () => {
      const cause = new NotFoundError(
        'Connection not found for type "github" with host "github.com"',
      );
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
          find: jest.fn().mockRejectedValue(cause),
        });

      let thrown: any;
      try {
        await provider.getCredentials({
          url: 'https://github.com/backstage/backstage',
        });
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(ForwardedError);
      expect(thrown).toHaveProperty('cause');
      expect(thrown.cause).toBeInstanceOf(NotFoundError);
    });

    it('preserves other connection lookup errors', async () => {
      const cause = new Error('lookup failed');
      const provider =
        DefaultGithubCredentialsProvider.experimentalFromConnections({
          find: jest.fn().mockRejectedValue(cause),
        });

      let thrown: any;
      try {
        await provider.getCredentials({
          url: 'https://github.com/backstage/backstage',
        });
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(ForwardedError);
      expect(thrown).toHaveProperty('cause');
      expect(thrown.cause).toBeInstanceOf(Error);
    });
  });

  describe('#getCredentials', () => {
    it('returns the data verbatim from the creds provider', async () => {
      const provider =
        DefaultGithubCredentialsProvider.fromIntegrations(integrations);
      const gitHubCredentials = await provider.getCredentials({
        url: 'https://github.com/blah',
      });
      const gritHubCredentials = await provider.getCredentials({
        url: 'https://grithub.com/blah',
      });

      expect(gitHubCredentials).toEqual({
        type: 'token',
        token: 'github.com-token',
        headers: {
          token: 'github.com-token',
        },
      });

      expect(gritHubCredentials).toEqual({
        type: 'token',
        token: 'grithub.com-token',
        headers: {
          token: 'grithub.com-token',
        },
      });
    });
  });
});
