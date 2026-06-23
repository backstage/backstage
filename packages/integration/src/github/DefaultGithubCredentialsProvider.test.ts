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
import { GithubIntegrationConfig } from './config';
import { SingleInstanceGithubCredentialsProvider } from './SingleInstanceGithubCredentialsProvider';

import { DefaultGithubCredentialsProvider } from './DefaultGithubCredentialsProvider';
import { ConfigReader } from '@backstage/config';
import { GithubCredentials } from './types';
import { ConnectionsService } from '@backstage/connections';

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
      const provider = DefaultGithubCredentialsProvider.fromConnections({
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
      const provider = DefaultGithubCredentialsProvider.fromConnections({
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
