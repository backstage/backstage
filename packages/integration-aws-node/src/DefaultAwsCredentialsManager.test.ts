/*
 * Copyright 2022 The Backstage Authors
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

import { DefaultAwsCredentialsManager } from './DefaultAwsCredentialsManager';
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import {
  STSClient,
  GetCallerIdentityCommand,
  AssumeRoleCommand,
} from '@aws-sdk/client-sts';
import { Config, ConfigReader } from '@backstage/config';
import { promises } from 'fs';

const env = process.env;
let stsMock: AwsClientStub<STSClient>;
let config: Config;

jest.mock('fs', () => ({ promises: { readFile: jest.fn() } }));

describe('DefaultAwsCredentialsManager', () => {
  beforeEach(() => {
    process.env = { ...env };
    jest.resetAllMocks();

    stsMock = mockClient(STSClient);

    config = new ConfigReader({
      aws: {
        accounts: [
          {
            accountId: '111111111111',
            roleName: 'hello',
            externalId: 'world',
          },
          {
            accountId: '222222222222',
            roleName: 'hi',
            partition: 'aws-other',
            region: 'not-us-east-1',
            accessKeyId: 'ABC',
            secretAccessKey: 'EDF',
          },
          {
            accountId: '333333333333',
            accessKeyId: 'my-access-key',
            secretAccessKey: 'my-secret-access-key',
          },
          {
            accountId: '444444444444',
          },
          {
            accountId: '555555555555',
            profile: 'my-profile',
          },
        ],
        accountDefaults: {
          roleName: 'backstage-role',
          externalId: 'my-id',
        },
        mainAccount: {
          accessKeyId: 'GHI',
          secretAccessKey: 'JKL',
          region: 'ap-northeast-1',
        },
      },
    });

    stsMock.on(GetCallerIdentityCommand).resolvesOnce({
      Account: '123456789012',
    });

    stsMock
      .on(AssumeRoleCommand, {
        RoleArn: 'arn:aws:iam::111111111111:role/hello',
        RoleSessionName: 'backstage',
        ExternalId: 'world',
      })
      .resolves({
        Credentials: {
          AccessKeyId: 'ACCESS_KEY_ID_1',
          SecretAccessKey: 'SECRET_ACCESS_KEY_1',
          SessionToken: 'SESSION_TOKEN_1',
          Expiration: new Date('2022-01-01'),
        },
      });

    stsMock
      .on(AssumeRoleCommand, {
        RoleArn: 'arn:aws-other:iam::222222222222:role/hi',
        RoleSessionName: 'backstage',
      })
      .resolves({
        Credentials: {
          AccessKeyId: 'ACCESS_KEY_ID_2',
          SecretAccessKey: 'SECRET_ACCESS_KEY_2',
          SessionToken: 'SESSION_TOKEN_2',
          Expiration: new Date('2022-01-02'),
        },
      });

    stsMock
      .on(AssumeRoleCommand, {
        RoleArn: 'arn:aws:iam::999999999999:role/backstage-role',
        RoleSessionName: 'backstage',
        ExternalId: 'my-id',
      })
      .resolves({
        Credentials: {
          AccessKeyId: 'ACCESS_KEY_ID_9',
          SecretAccessKey: 'SECRET_ACCESS_KEY_9',
          SessionToken: 'SESSION_TOKEN_9',
          Expiration: new Date('2022-01-09'),
        },
      });

    process.env.AWS_ACCESS_KEY_ID = 'ACCESS_KEY_ID_10';
    process.env.AWS_SECRET_ACCESS_KEY = 'SECRET_ACCESS_KEY_10';
    process.env.AWS_SESSION_TOKEN = 'SESSION_TOKEN_10';
    process.env.AWS_CREDENTIAL_EXPIRATION = new Date(
      '2022-01-10',
    ).toISOString();

    const mockProfile = `[my-profile]
    aws_access_key_id=ACCESS_KEY_ID_9
    aws_secret_access_key=SECRET_ACCESS_KEY_9
    `;
    (promises.readFile as jest.Mock).mockResolvedValue(mockProfile);
  });

  afterEach(() => {
    process.env = env;
  });

  describe('#getCredentialProvider', () => {
    it('retrieves assume-role creds for the given account ID and caches the provider', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '111111111111',
      });

      expect(awsCredentialProvider.accountId).toEqual('111111111111');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_1',
        secretAccessKey: 'SECRET_ACCESS_KEY_1',
        sessionToken: 'SESSION_TOKEN_1',
        expiration: new Date('2022-01-01'),
      });

      const awsCredentialProvider2 = await provider.getCredentialProvider({
        accountId: '111111111111',
      });

      expect(awsCredentialProvider).toBe(awsCredentialProvider2);
      expect(stsMock).toHaveReceivedCommandTimes(AssumeRoleCommand, 1);
    });

    it('retrieves assume-role creds in another partition for the given account ID', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '222222222222',
      });

      expect(awsCredentialProvider.accountId).toEqual('222222222222');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_2',
        secretAccessKey: 'SECRET_ACCESS_KEY_2',
        sessionToken: 'SESSION_TOKEN_2',
        expiration: new Date('2022-01-02'),
      });
    });

    it('retrieves assume-role creds for an account using the account defaults', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '999999999999',
      });

      expect(awsCredentialProvider.accountId).toEqual('999999999999');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_9',
        secretAccessKey: 'SECRET_ACCESS_KEY_9',
        sessionToken: 'SESSION_TOKEN_9',
        expiration: new Date('2022-01-09'),
      });
    });

    it('retrieves static creds for the given account ID', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '333333333333',
      });

      expect(awsCredentialProvider.accountId).toEqual('333333333333');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'my-access-key',
        secretAccessKey: 'my-secret-access-key',
      });
    });

    it('retrieves static creds from the main account', async () => {
      const minConfig = new ConfigReader({
        aws: {
          mainAccount: {
            accessKeyId: 'GHI',
            secretAccessKey: 'JKL',
          },
        },
      });
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '123456789012',
      });

      expect(awsCredentialProvider.accountId).toEqual('123456789012');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'GHI',
        secretAccessKey: 'JKL',
      });
    });

    it('only queries the main account ID once from STS', async () => {
      const minConfig = new ConfigReader({
        aws: {
          mainAccount: {
            accessKeyId: 'GHI',
            secretAccessKey: 'JKL',
          },
        },
      });
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      const awsCredentialProvider1 = await provider.getCredentialProvider({
        accountId: '123456789012',
      });
      const awsCredentialProvider2 = await provider.getCredentialProvider({
        accountId: '123456789012',
      });

      expect(awsCredentialProvider1).toBe(awsCredentialProvider2);
      expect(stsMock).toHaveReceivedCommandTimes(GetCallerIdentityCommand, 1);
    });

    it('retrieves the ini provider chain for the given account ID', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '555555555555',
      });

      expect(awsCredentialProvider.accountId).toEqual('555555555555');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_9',
        secretAccessKey: 'SECRET_ACCESS_KEY_9',
      });
    });

    it('retrieves the default cred provider chain for the given account ID', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '444444444444',
      });

      expect(awsCredentialProvider.accountId).toEqual('444444444444');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_10',
        secretAccessKey: 'SECRET_ACCESS_KEY_10',
        sessionToken: 'SESSION_TOKEN_10',
        expiration: new Date('2022-01-10'),
      });
    });

    it('retrieves ini provider chain from the main account', async () => {
      const minConfig = new ConfigReader({
        aws: {
          mainAccount: {
            profile: 'my-profile',
          },
        },
      });
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '123456789012',
      });

      expect(awsCredentialProvider.accountId).toEqual('123456789012');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_9',
        secretAccessKey: 'SECRET_ACCESS_KEY_9',
      });
    });

    it('retrieves default cred provider chain from the main account', async () => {
      const minConfig = new ConfigReader({
        aws: {},
      });
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '123456789012',
      });

      expect(awsCredentialProvider.accountId).toEqual('123456789012');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_10',
        secretAccessKey: 'SECRET_ACCESS_KEY_10',
        sessionToken: 'SESSION_TOKEN_10',
        expiration: new Date('2022-01-10'),
      });
    });

    it('retrieves default cred provider chain from the main account when there is no AWS integration config', async () => {
      const minConfig = new ConfigReader({});
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      const awsCredentialProvider = await provider.getCredentialProvider({
        accountId: '123456789012',
      });

      expect(awsCredentialProvider.accountId).toEqual('123456789012');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_10',
        secretAccessKey: 'SECRET_ACCESS_KEY_10',
        sessionToken: 'SESSION_TOKEN_10',
        expiration: new Date('2022-01-10'),
      });
    });

    it('extracts the account ID from an ARN', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        arn: 'arn:aws:ecs:region:111111111111:service/cluster-name/service-name',
      });

      expect(awsCredentialProvider.accountId).toEqual('111111111111');

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'ACCESS_KEY_ID_1',
        secretAccessKey: 'SECRET_ACCESS_KEY_1',
        sessionToken: 'SESSION_TOKEN_1',
        expiration: new Date('2022-01-01'),
      });
    });

    it('falls back to main account credentials when account ID cannot be extracted from the ARN', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({
        arn: 'arn:aws:s3:::bucket_name',
      });

      expect(awsCredentialProvider.accountId).toBeUndefined();

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'GHI',
        secretAccessKey: 'JKL',
      });
    });

    it('falls back to main account credentials when neither account ID nor ARN are provided', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider({});

      expect(awsCredentialProvider.accountId).toBeUndefined();

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'GHI',
        secretAccessKey: 'JKL',
      });
    });

    it('falls back to main account credentials when no options are provided', async () => {
      const provider = DefaultAwsCredentialsManager.fromConfig(config);
      const awsCredentialProvider = await provider.getCredentialProvider();

      expect(awsCredentialProvider.accountId).toBeUndefined();

      const creds = await awsCredentialProvider.sdkCredentialProvider();
      expect(creds).toEqual({
        accessKeyId: 'GHI',
        secretAccessKey: 'JKL',
      });
    });

    it('rejects account that is not configured, with no account defaults', async () => {
      const minConfig = new ConfigReader({
        aws: {},
      });
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      await expect(
        provider.getCredentialProvider({ accountId: '111222333444' }),
      ).rejects.toThrow(/no AWS integration that matches 111222333444/);
    });

    it('rejects main account that has invalid credentials', async () => {
      stsMock.on(GetCallerIdentityCommand).rejects('No credentials found');
      const minConfig = new ConfigReader({});
      const provider = DefaultAwsCredentialsManager.fromConfig(minConfig);
      await expect(
        provider.getCredentialProvider({ accountId: '123456789012' }),
      ).rejects.toThrow(/No credentials found/);
    });
  });
});
