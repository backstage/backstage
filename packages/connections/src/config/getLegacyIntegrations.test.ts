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
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { connectionTypes } from '../definitions/types';
import { getLegacyIntegrations } from './getLegacyIntegrations';

function rootConfig(options: { data: JsonObject }) {
  return new ConfigReader(options.data);
}

function configFields(connection: Record<string, unknown>) {
  const { type, auth, title, match, ...config } = connection;
  return config;
}

const AwsConnectionType = connectionTypes.aws;
const AwsCodeCommitConnectionType = connectionTypes['aws-codecommit'];
const AwsS3ConnectionType = connectionTypes['aws-s3'];
const AzureBlobStorageConnectionType = connectionTypes['azure-blob-storage'];
const AzureConnectionType = connectionTypes.azure;
const BitbucketCloudConnectionType = connectionTypes['bitbucket-cloud'];
const BitbucketServerConnectionType = connectionTypes['bitbucket-server'];
const GerritConnectionType = connectionTypes.gerrit;
const GiteaConnectionType = connectionTypes.gitea;
const GithubConnectionType = connectionTypes.github;
const GitlabConnectionType = connectionTypes.gitlab;
const GoogleGcsConnectionType = connectionTypes['google-gcs'];
const HarnessConnectionType = connectionTypes.harness;

describe('getLegacyIntegrations', () => {
  it('returns an empty list when no integrations are configured', () => {
    const config = rootConfig({ data: {} });
    expect(getLegacyIntegrations(config)).toEqual([]);
  });

  describe('github', () => {
    it('converts a token-only integration to a connection with a single token auth method', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [
              {
                host: 'github.com',
                token: 'gh-token',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'github',
          host: 'github.com',
          auth: [{ method: 'token', token: 'gh-token' }],
        },
      ]);
    });

    it('converts apiBaseUrl and rawBaseUrl when present', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [
              {
                host: 'enterprise.example.com',
                apiBaseUrl: 'https://enterprise.example.com/api/v3',
                rawBaseUrl: 'https://enterprise.example.com/raw',
                token: 'enterprise-token',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'github',
          host: 'enterprise.example.com',
          apiBaseUrl: 'https://enterprise.example.com/api/v3',
          rawBaseUrl: 'https://enterprise.example.com/raw',
          auth: [{ method: 'token', token: 'enterprise-token' }],
        },
      ]);
    });

    it('merges a top-level token and multiple apps into a single connection', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [
              {
                host: 'github.com',
                token: 'gh-token',
                apps: [
                  {
                    appId: 1,
                    privateKey: 'pk-1',
                    clientId: 'client-1',
                    clientSecret: 'secret-1',
                  },
                  {
                    appId: 2,
                    privateKey: 'pk-2',
                    clientId: 'client-2',
                    clientSecret: 'secret-2',
                    webhookSecret: 'whsec',
                    allowedInstallationOwners: ['acme', 'widgets'],
                    publicAccess: true,
                  },
                ],
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'github',
          host: 'github.com',
          auth: [
            { method: 'token', token: 'gh-token' },
            {
              method: 'app',
              appId: 1,
              privateKey: 'pk-1',
              clientId: 'client-1',
              clientSecret: 'secret-1',
            },
            {
              method: 'app',
              appId: 2,
              privateKey: 'pk-2',
              clientId: 'client-2',
              clientSecret: 'secret-2',
              webhookSecret: 'whsec',
              orgs: ['acme', 'widgets'],
              publicAccess: true,
            },
          ],
        },
      ]);
    });

    it('emits one connection per legacy entry, preserving order', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [
              { host: 'github.com', token: 'public' },
              { host: 'enterprise.example.com', token: 'enterprise' },
            ],
          },
        },
      });

      const result = getLegacyIntegrations(config);
      expect(result.map(c => (c as { host: string }).host)).toEqual([
        'github.com',
        'enterprise.example.com',
      ]);
    });

    it('uses none auth when neither token nor apps are configured', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [{ host: 'github.com' }],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        { type: 'github', host: 'github.com', auth: [{ method: 'none' }] },
      ]);
    });

    it('defaults the host to github.com like the legacy reader', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [{ token: 'gh-token' }],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'github',
          host: 'github.com',
          auth: [{ method: 'token', token: 'gh-token' }],
        },
      ]);
    });

    it('produces output that validates against the github connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            github: [
              {
                host: 'github.com',
                token: 'gh-token',
                apps: [
                  {
                    appId: 1,
                    privateKey: 'pk',
                    clientId: 'client',
                    clientSecret: 'secret',
                    allowedInstallationOwners: ['acme'],
                    publicAccess: true,
                  },
                ],
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        GithubConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('gitlab', () => {
    it('converts a token-only integration to a connection with a single token auth method', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitlab: [
              {
                host: 'gitlab.com',
                token: 'gl-token',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'gitlab',
          host: 'gitlab.com',
          auth: [{ method: 'token', token: 'gl-token' }],
        },
      ]);
    });

    it('carries apiBaseUrl and baseUrl through when present', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitlab: [
              {
                host: 'gitlab.example.com',
                apiBaseUrl: 'https://gitlab.example.com/api/v4',
                baseUrl: 'https://gitlab.example.com',
                token: 'self-hosted-token',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'gitlab',
          host: 'gitlab.example.com',
          apiBaseUrl: 'https://gitlab.example.com/api/v4',
          baseUrl: 'https://gitlab.example.com',
          auth: [{ method: 'token', token: 'self-hosted-token' }],
        },
      ]);
    });

    it('drops commitSigningKey and retry config during conversion', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitlab: [
              {
                host: 'gitlab.com',
                token: 'gl-token',
                commitSigningKey: 'pgp-key',
                retry: {
                  maxRetries: 3,
                  retryStatusCodes: [429, 503],
                  maxApiRequestsPerMinute: 60,
                },
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'gitlab',
          host: 'gitlab.com',
          auth: [{ method: 'token', token: 'gl-token' }],
        },
      ]);
    });

    it('uses none auth when no token is configured', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitlab: [{ host: 'gitlab.com' }],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        { type: 'gitlab', host: 'gitlab.com', auth: [{ method: 'none' }] },
      ]);
    });

    it('produces output that validates against the gitlab connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitlab: [
              {
                host: 'gitlab.example.com',
                apiBaseUrl: 'https://gitlab.example.com/api/v4',
                baseUrl: 'https://gitlab.example.com',
                token: 'gl-token',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        GitlabConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('bitbucket-cloud', () => {
    it('hardcodes the host to bitbucket.org and emits one auth method per credential pair', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketCloud: [
              {
                username: 'user',
                token: 'tok',
                appPassword: 'pwd',
                clientId: 'cid',
                clientSecret: 'csecret',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'bitbucket-cloud',
          host: 'bitbucket.org',
          auth: [
            { method: 'token', username: 'user', token: 'tok' },
            { method: 'appPassword', username: 'user', appPassword: 'pwd' },
            { method: 'oauth', clientId: 'cid', clientSecret: 'csecret' },
          ],
        },
      ]);
    });

    it('skips token/appPassword auth when username is missing', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketCloud: [
              {
                token: 'tok',
                appPassword: 'pwd',
                clientId: 'cid',
                clientSecret: 'csecret',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(
        (converted as { auth: { method: string }[] }).auth.map(a => a.method),
      ).toEqual(['oauth']);
    });

    it('produces output that validates against the bitbucket-cloud connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketCloud: [
              {
                username: 'user',
                token: 'tok',
                clientId: 'cid',
                clientSecret: 'csecret',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        BitbucketCloudConnectionType.configSchema.parse(
          configFields(converted),
        ),
      ).not.toThrow();
    });
  });

  describe('bitbucket-server', () => {
    it('emits separate token and basic auth methods', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketServer: [
              {
                host: 'bitbucket.example.com',
                apiBaseUrl: 'https://bitbucket.example.com/rest/api/1.0',
                token: 'tok',
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'bitbucket-server',
          host: 'bitbucket.example.com',
          apiBaseUrl: 'https://bitbucket.example.com/rest/api/1.0',
          auth: [
            { method: 'token', token: 'tok' },
            { method: 'basic', username: 'user', password: 'pwd' },
          ],
        },
      ]);
    });

    it('drops commitSigningKey during conversion', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketServer: [
              {
                host: 'bitbucket.example.com',
                token: 'tok',
                commitSigningKey: 'pgp',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'bitbucket-server',
          host: 'bitbucket.example.com',
          auth: [{ method: 'token', token: 'tok' }],
        },
      ]);
    });

    it('produces output that validates against the bitbucket-server connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            bitbucketServer: [
              {
                host: 'bitbucket.example.com',
                apiBaseUrl: 'https://bitbucket.example.com/rest/api/1.0',
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        BitbucketServerConnectionType.configSchema.parse(
          configFields(converted),
        ),
      ).not.toThrow();
    });
  });

  describe('azure', () => {
    it('emits one auth method per credentials[] entry, picking the type by which fields are set', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azure: [
              {
                host: 'dev.azure.com',
                credentials: [
                  {
                    organizations: ['acme'],
                    personalAccessToken: 'pat-token',
                  },
                  {
                    clientId: 'cid',
                    clientSecret: 'csecret',
                    tenantId: 'tid',
                  },
                  {
                    clientId: 'mi-cid',
                    tenantId: 'tid',
                    managedIdentityClientId: 'mi-id',
                  },
                  {
                    clientId: 'system-assigned',
                  },
                ],
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'azure',
          host: 'dev.azure.com',
          auth: [
            {
              method: 'pat',
              personalAccessToken: 'pat-token',
              orgs: ['acme'],
            },
            {
              method: 'clientCredentials',
              clientId: 'cid',
              clientSecret: 'csecret',
              tenantId: 'tid',
            },
            {
              method: 'managedIdentity',
              clientId: 'mi-cid',
              tenantId: 'tid',
              managedIdentityClientId: 'mi-id',
            },
            {
              method: 'managedIdentity',
              clientId: 'system-assigned',
            },
          ],
        },
      ]);
    });

    it('drops credential entries with no recognisable auth fields and drops commitSigningKey', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azure: [
              {
                host: 'dev.azure.com',
                commitSigningKey: 'pgp',
                credentials: [{ organizations: ['acme'] }],
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        { type: 'azure', host: 'dev.azure.com', auth: [{ method: 'none' }] },
      ]);
    });

    it('defaults the host to dev.azure.com like the legacy reader', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azure: [{ credentials: [{ personalAccessToken: 'pat' }] }],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'azure',
          host: 'dev.azure.com',
          auth: [{ method: 'pat', personalAccessToken: 'pat' }],
        },
      ]);
    });

    it('produces output that validates against the azure connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azure: [
              {
                host: 'dev.azure.com',
                credentials: [{ personalAccessToken: 'pat' }],
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        AzureConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('gerrit', () => {
    it('keeps addressing fields and emits a basic auth method', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gerrit: [
              {
                host: 'gerrit.example.com',
                baseUrl: 'https://gerrit.example.com',
                gitilesBaseUrl: 'https://gerrit.example.com/plugins/gitiles',
                cloneUrl: 'https://gerrit.example.com/clone',
                disableEditUrl: true,
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'gerrit',
          host: 'gerrit.example.com',
          baseUrl: 'https://gerrit.example.com',
          gitilesBaseUrl: 'https://gerrit.example.com/plugins/gitiles',
          cloneUrl: 'https://gerrit.example.com/clone',
          auth: [{ method: 'basic', username: 'user', password: 'pwd' }],
        },
      ]);
    });

    it('produces output that validates against the gerrit connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gerrit: [
              {
                host: 'gerrit.example.com',
                gitilesBaseUrl: 'https://gerrit.example.com/plugins/gitiles',
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        GerritConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('gitea', () => {
    it('keeps host/baseUrl and emits a basic auth method', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitea: [
              {
                host: 'gitea.example.com',
                baseUrl: 'https://gitea.example.com',
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'gitea',
          host: 'gitea.example.com',
          baseUrl: 'https://gitea.example.com',
          auth: [{ method: 'basic', username: 'user', password: 'pwd' }],
        },
      ]);
    });

    it('produces output that validates against the gitea connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            gitea: [
              {
                host: 'gitea.example.com',
                username: 'user',
                password: 'pwd',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        GiteaConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('aws', () => {
    it('converts accounts, mainAccount, and accountDefaults from top-level aws config', () => {
      const config = rootConfig({
        data: {
          aws: {
            accountDefaults: {
              roleName: 'backstage-role',
              partition: 'aws',
              region: 'us-east-1',
              externalId: 'default-ext',
            },
            mainAccount: {
              profile: 'main-profile',
              region: 'eu-west-1',
            },
            accounts: [
              {
                accountId: '111111111111',
                roleName: 'my-role',
                externalId: 'ext-id',
              },
              {
                accountId: '222222222222',
                accessKeyId: 'AKID',
                secretAccessKey: 'secret',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'aws',
          roleName: 'backstage-role',
          partition: 'aws',
          region: 'us-east-1',
          externalId: 'default-ext',
          auth: [
            {
              method: 'account',
              accountId: '111111111111',
              roleName: 'my-role',
              externalId: 'ext-id',
            },
            {
              method: 'account',
              accountId: '222222222222',
              accessKeyId: 'AKID',
              secretAccessKey: 'secret',
            },
            {
              method: 'account',
              mainAccount: true,
              profile: 'main-profile',
              region: 'eu-west-1',
            },
          ],
        },
      ]);
    });

    it('always emits a main account entry, matching the implicit legacy default credentials chain', () => {
      const emptyAws = rootConfig({ data: { aws: {} } });
      expect(getLegacyIntegrations(emptyAws)).toEqual([
        {
          type: 'aws',
          auth: [{ method: 'account', mainAccount: true }],
        },
      ]);

      const accountsOnly = rootConfig({
        data: {
          aws: {
            accounts: [{ accountId: '111111111111', profile: 'other' }],
          },
        },
      });
      expect(getLegacyIntegrations(accountsOnly)).toEqual([
        {
          type: 'aws',
          auth: [
            { method: 'account', accountId: '111111111111', profile: 'other' },
            { method: 'account', mainAccount: true },
          ],
        },
      ]);
    });

    it('keeps the first entry when accounts duplicate an account ID, matching the legacy lookup behavior', () => {
      const config = rootConfig({
        data: {
          aws: {
            accounts: [
              {
                accountId: '111111111111',
                accessKeyId: 'first-key',
                secretAccessKey: 'first-secret',
              },
              {
                accountId: '111111111111',
                accessKeyId: 'second-key',
                secretAccessKey: 'second-secret',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      const accounts = (converted.auth as { accountId?: string }[]).filter(
        a => a.accountId === '111111111111',
      );
      expect(accounts).toEqual([
        {
          method: 'account',
          accountId: '111111111111',
          accessKeyId: 'first-key',
          secretAccessKey: 'first-secret',
        },
      ]);
    });

    it('produces output that validates against the aws connection schema', () => {
      const config = rootConfig({
        data: {
          aws: {
            accountDefaults: { roleName: 'backstage-role' },
            mainAccount: { accessKeyId: 'AKID', secretAccessKey: 'secret' },
            accounts: [
              { accountId: '111111111111', roleName: 'my-role' },
              {
                accountId: '222222222222',
                roleName: 'other-role',
                webIdentityTokenFile: '/token',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);

      // Mirrors what DefaultConnectionsService does: parse the connection
      // config and each auth entry, then apply the cross-entry validation.
      const parsedConfig = AwsConnectionType.configSchema.parse(
        configFields(converted),
      );
      const parsedAuth = (converted.auth as Array<Record<string, unknown>>).map(
        ({ method, ...fields }) => ({
          method: 'account' as const,
          ...AwsConnectionType.authMethods[0].configSchema.parse(fields),
        }),
      );
      expect(() =>
        AwsConnectionType.validate?.({
          config: parsedConfig,
          auth: parsedAuth,
        }),
      ).not.toThrow();
    });
  });

  describe('awsCodeCommit', () => {
    it('emits separate accessKey and assumeRole auth methods', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsCodeCommit: [
              {
                region: 'us-east-1',
                accessKeyId: 'AKID',
                secretAccessKey: 'secret',
                roleArn: 'arn:aws:iam::123456789012:role/MyRole',
                externalId: 'ext-id',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'aws-codecommit',
          host: 'us-east-1.console.aws.amazon.com',
          region: 'us-east-1',
          auth: [
            {
              method: 'accessKey',
              accessKeyId: 'AKID',
              secretAccessKey: 'secret',
            },
            {
              method: 'assumeRole',
              roleArn: 'arn:aws:iam::123456789012:role/MyRole',
              externalId: 'ext-id',
            },
          ],
        },
      ]);
    });

    it('omits externalId when not set', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsCodeCommit: [
              {
                region: 'eu-west-1',
                roleArn: 'arn:aws:iam::123456789012:role/MyRole',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(
        (converted as { auth: { externalId?: string }[] }).auth[0],
      ).not.toHaveProperty('externalId');
    });

    it('emits an empty auth array when aws-codecommit credentials are not configured', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsCodeCommit: [{ region: 'us-west-2' }],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'aws-codecommit',
          host: 'us-west-2.console.aws.amazon.com',
          region: 'us-west-2',
          auth: [],
        },
      ]);
    });

    it('produces output that validates against the aws-codecommit connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsCodeCommit: [
              {
                region: 'us-east-1',
                accessKeyId: 'AKID',
                secretAccessKey: 'secret',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        AwsCodeCommitConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('awsS3', () => {
    it('emits accessKey and assumeRole auth methods', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsS3: [
              {
                accessKeyId: 'AKID',
                secretAccessKey: 'secret',
                roleArn: 'arn:aws:iam::123456789012:role/MyRole',
                externalId: 'ext-id',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'aws-s3',
          host: 'amazonaws.com',
          auth: [
            {
              method: 'accessKey',
              accessKeyId: 'AKID',
              secretAccessKey: 'secret',
            },
            {
              method: 'assumeRole',
              roleArn: 'arn:aws:iam::123456789012:role/MyRole',
              externalId: 'ext-id',
            },
          ],
        },
      ]);
    });

    it('carries endpoint and s3ForcePathStyle through when present', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsS3: [
              {
                endpoint: 'http://localhost:4566',
                s3ForcePathStyle: true,
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'aws-s3',
          host: 'localhost:4566',
          endpoint: 'http://localhost:4566',
          s3ForcePathStyle: true,
          auth: [{ method: 'none' }],
        },
      ]);
    });

    it('throws a friendly error for an invalid endpoint URL', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsS3: [{ endpoint: 'not a url' }],
          },
        },
      });

      expect(() => getLegacyIntegrations(config)).toThrow(
        'Invalid endpoint URL "not a url" in integrations.awsS3 config',
      );
    });

    it('produces output that validates against the aws-s3 connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            awsS3: [
              {
                accessKeyId: 'AKID',
                secretAccessKey: 'secret',
                roleArn: 'arn:aws:iam::123456789012:role/MyRole',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        AwsS3ConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('googleGcs', () => {
    it('converts the single googleGcs object to a connection with a serviceAccount auth method', () => {
      const config = rootConfig({
        data: {
          integrations: {
            googleGcs: {
              clientEmail: 'sa@project.iam.gserviceaccount.com',
              privateKey:
                '-----BEGIN RSA PRIVATE KEY-----\nkey\n-----END RSA PRIVATE KEY-----',
            },
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'google-gcs',
          host: 'storage.cloud.google.com',
          auth: [
            {
              method: 'serviceAccount',
              clientEmail: 'sa@project.iam.gserviceaccount.com',
              privateKey:
                '-----BEGIN RSA PRIVATE KEY-----\nkey\n-----END RSA PRIVATE KEY-----',
            },
          ],
        },
      ]);
    });

    it('restores escaped newlines in the private key like the legacy reader', () => {
      const config = rootConfig({
        data: {
          integrations: {
            googleGcs: {
              clientEmail: 'sa@project.iam.gserviceaccount.com',
              privateKey:
                '-----BEGIN RSA PRIVATE KEY-----\\nkey\\n-----END RSA PRIVATE KEY-----',
            },
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect((converted.auth as [{ privateKey: string }])[0].privateKey).toBe(
        '-----BEGIN RSA PRIVATE KEY-----\nkey\n-----END RSA PRIVATE KEY-----',
      );
    });

    it('uses none auth when no explicit credentials are configured', () => {
      const config = rootConfig({
        data: {
          integrations: {
            googleGcs: {},
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'google-gcs',
          host: 'storage.cloud.google.com',
          auth: [{ method: 'none' }],
        },
      ]);
    });

    it('produces output that validates against the google-gcs connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            googleGcs: {
              clientEmail: 'sa@project.iam.gserviceaccount.com',
              privateKey: 'pk',
            },
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        GoogleGcsConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });

  describe('azureBlobStorage', () => {
    it('emits one auth method per credential type present', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                accountName: 'myaccount',
                accountKey: 'ak',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'azure-blob-storage',
          host: 'blob.core.windows.net',
          accountName: 'myaccount',
          auth: [{ method: 'accountKey', accountKey: 'ak' }],
        },
      ]);
    });

    it('converts a sasToken credential', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                accountName: 'myaccount',
                sasToken:
                  'sv=2021-01-01&ss=b&srt=sco&sp=rwdlacupiytfx&se=2024-01-01T00:00:00Z&st=2023-01-01T00:00:00Z&spr=https&sig=abc',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect((converted as { auth: { method: string }[] }).auth).toEqual([
        { method: 'sasToken', sasToken: expect.any(String) },
      ]);
    });

    it('converts a connectionString credential', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                connectionString:
                  'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=key;EndpointSuffix=core.windows.net',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect((converted as { auth: { method: string }[] }).auth).toEqual([
        { method: 'connectionString', connectionString: expect.any(String) },
      ]);
    });

    it('converts an aadCredential', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                accountName: 'myaccount',
                aadCredential: {
                  clientId: 'cid',
                  tenantId: 'tid',
                  clientSecret: 'csecret',
                },
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'azure-blob-storage',
          host: 'blob.core.windows.net',
          accountName: 'myaccount',
          auth: [
            {
              method: 'aadCredential',
              clientId: 'cid',
              tenantId: 'tid',
              clientSecret: 'csecret',
            },
          ],
        },
      ]);
    });

    it('carries endpoint and endpointSuffix through when present', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                accountName: 'myaccount',
                endpoint: 'https://myaccount.blob.core.usgovcloudapi.net',
                endpointSuffix: 'core.usgovcloudapi.net',
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(converted).toMatchObject({
        endpoint: 'https://myaccount.blob.core.usgovcloudapi.net',
        endpointSuffix: 'core.usgovcloudapi.net',
      });
    });

    it('throws a friendly error for an invalid endpoint URL', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [{ endpoint: 'not a url' }],
          },
        },
      });

      expect(() => getLegacyIntegrations(config)).toThrow(
        'Invalid endpoint URL "not a url" in integrations.azureBlobStorage config',
      );
    });

    it('produces output that validates against the azure-blob-storage connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            azureBlobStorage: [
              {
                accountName: 'myaccount',
                aadCredential: {
                  clientId: 'cid',
                  tenantId: 'tid',
                  clientSecret: 'csecret',
                },
              },
            ],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        AzureBlobStorageConnectionType.configSchema.parse(
          configFields(converted),
        ),
      ).not.toThrow();
    });
  });

  describe('harness', () => {
    it('emits a token auth method carrying the optional apiKey', () => {
      const config = rootConfig({
        data: {
          integrations: {
            harness: [
              {
                host: 'app.harness.io',
                apiKey: 'ak',
                token: 'tok',
              },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'harness',
          host: 'app.harness.io',
          auth: [{ method: 'token', token: 'tok', apiKey: 'ak' }],
        },
      ]);
    });

    it('skips entries without a token, which cannot be represented as a connection', () => {
      const config = rootConfig({
        data: {
          integrations: {
            harness: [
              { host: 'app.harness.io', apiKey: 'ak' },
              { host: 'other.harness.io' },
              { host: 'kept.harness.io', token: 'tok' },
            ],
          },
        },
      });

      expect(getLegacyIntegrations(config)).toEqual([
        {
          type: 'harness',
          host: 'kept.harness.io',
          auth: [{ method: 'token', token: 'tok' }],
        },
      ]);
    });

    it('produces output that validates against the harness connection schema', () => {
      const config = rootConfig({
        data: {
          integrations: {
            harness: [{ host: 'app.harness.io', token: 'tok', apiKey: 'ak' }],
          },
        },
      });

      const [converted] = getLegacyIntegrations(config);
      expect(() =>
        HarnessConnectionType.configSchema.parse(configFields(converted)),
      ).not.toThrow();
    });
  });
});
