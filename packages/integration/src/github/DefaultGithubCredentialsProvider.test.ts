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
import { GitHubIntegrationConfig } from './config';
import { SingleInstanceGithubCredentialsProvider } from './SingleInstanceGithubCredentialsProvider';

import { DefaultGithubCredentialsProvider } from './DefaultGithubCredentialsProvider';
import { ConfigReader } from '@backstage/config';
import { GithubCredentials } from './types';

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
      config: GitHubIntegrationConfig,
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
