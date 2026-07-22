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

import {
  readAwsIntegrationConfig,
  AwsIntegrationAccountConfig,
  AwsIntegrationDefaultAccountConfig,
  AwsIntegrationMainAccountConfig,
} from './config';
import {
  AwsCredentialsManager,
  AwsCredentialsManagerConnectionOptions,
  AwsCredentialProvider,
  AwsCredentialProviderOptions,
} from './types';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import {
  fromIni,
  fromNodeProviderChain,
  fromTemporaryCredentials,
  fromTokenFile,
} from '@aws-sdk/credential-providers';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { parse } from '@aws-sdk/util-arn-parser';
import { Config } from '@backstage/config';
import type { Connection, ConnectionsService } from '@backstage/connections';

type AwsConnectionCredentialSource = {
  connections: ConnectionsService;
  options: AwsCredentialsManagerConnectionOptions;
};

/**
 * Retrieves the account ID for the given credential provider from STS.
 * Include the region if present, otherwise use the default region.
 */
async function fillInAccountId(credProvider: AwsCredentialProvider) {
  if (credProvider.accountId) {
    return;
  }

  const client = new STSClient({
    region: credProvider.stsRegion ?? 'us-east-1',
    customUserAgent: 'backstage-aws-credentials-manager',
    credentialDefaultProvider: () => credProvider.sdkCredentialProvider,
  });
  const resp = await client.send(new GetCallerIdentityCommand({}));
  credProvider.accountId = resp.Account!;
}

function getStaticCredentials(
  accessKeyId: string,
  secretAccessKey: string,
): AwsCredentialIdentityProvider {
  return async () => {
    return Promise.resolve({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });
  };
}

function getProfileCredentials(
  profile: string,
  region?: string,
): AwsCredentialIdentityProvider {
  return fromIni({
    profile,
    clientConfig: {
      region,
      customUserAgent: 'backstage-aws-credentials-manager',
    },
  });
}

/**
 * Include the region if present, otherwise use the default region.
 *
 * @see https://www.npmjs.com/package/@aws-sdk/credential-provider-node
 */
function getDefaultCredentialsChain(
  region = 'us-east-1',
): AwsCredentialIdentityProvider {
  return fromNodeProviderChain({ clientConfig: { region } });
}

/**
 * Constructs the credential provider needed by the AWS SDK from the given account config
 *
 * Order of precedence:
 * 1. Assume role with web identity token file (no static creds)
 * 2. Assume role with static creds
 * 3. Assume role with main account creds
 * 4. Static creds
 * 5. Profile creds
 * 6. Default AWS SDK creds chain
 */
function getSdkCredentialProvider(
  config: AwsIntegrationAccountConfig,
  mainAccountCredProvider: AwsCredentialIdentityProvider,
): AwsCredentialIdentityProvider {
  if (config.roleName) {
    const region = config.region ?? 'us-east-1';
    const partition = config.partition ?? 'aws';
    const roleArn = `arn:${partition}:iam::${config.accountId}:role/${config.roleName}`;

    if (config.webIdentityTokenFile) {
      // Defensive: same combinations the parser rejects.
      if (config.accessKeyId) {
        throw new Error(
          `AWS integration account ${config.accountId} has both a web identity token file and static credentials configured, but only one must be specified`,
        );
      }
      if (config.profile) {
        throw new Error(
          `AWS integration account ${config.accountId} has both a web identity token file and a profile configured, but only one must be specified`,
        );
      }
      if (config.externalId) {
        throw new Error(
          `AWS integration account ${config.accountId} has both a web identity token file and an external ID configured; AssumeRoleWithWebIdentity does not support external IDs.`,
        );
      }
      return fromTokenFile({
        webIdentityTokenFile: config.webIdentityTokenFile,
        roleArn,
        roleSessionName: 'backstage',
        clientConfig: {
          region,
          customUserAgent: 'backstage-aws-credentials-manager',
        },
      });
    }

    return fromTemporaryCredentials({
      masterCredentials: config.accessKeyId
        ? getStaticCredentials(config.accessKeyId!, config.secretAccessKey!)
        : mainAccountCredProvider,
      params: {
        RoleArn: roleArn,
        RoleSessionName: 'backstage',
        ExternalId: config.externalId,
      },
      clientConfig: {
        region,
        customUserAgent: 'backstage-aws-credentials-manager',
      },
    });
  }

  if (config.accessKeyId) {
    return getStaticCredentials(config.accessKeyId!, config.secretAccessKey!);
  }

  if (config.profile) {
    return getProfileCredentials(config.profile!, config.region);
  }

  return getDefaultCredentialsChain(config.region);
}

/**
 * Constructs the credential provider needed by the AWS SDK for the main account
 *
 * Order of precedence:
 * 1. Static creds
 * 2. Profile creds
 * 3. Default AWS SDK creds chain
 */
function getMainAccountSdkCredentialProvider(
  config: AwsIntegrationMainAccountConfig,
): AwsCredentialIdentityProvider {
  if (config.accessKeyId) {
    return getStaticCredentials(config.accessKeyId!, config.secretAccessKey!);
  }

  if (config.profile) {
    return getProfileCredentials(config.profile!, config.region);
  }

  return getDefaultCredentialsChain(config.region);
}

/**
 * Handles the creation and caching of credential providers for AWS accounts.
 *
 * @public
 */
export class DefaultAwsCredentialsManager implements AwsCredentialsManager {
  static fromConfig(config: Config): DefaultAwsCredentialsManager {
    const awsConfig = config.has('aws')
      ? readAwsIntegrationConfig(config.getConfig('aws'))
      : {
          accounts: [],
          mainAccount: {},
          accountDefaults: {},
        };

    const mainAccountSdkCredProvider = getMainAccountSdkCredentialProvider(
      awsConfig.mainAccount,
    );
    const mainAccountCredProvider: AwsCredentialProvider = {
      stsRegion: awsConfig.mainAccount.region,
      sdkCredentialProvider: mainAccountSdkCredProvider,
    };

    const accountCredProviders = new Map<string, AwsCredentialProvider>();
    for (const accountConfig of awsConfig.accounts) {
      const sdkCredentialProvider = getSdkCredentialProvider(
        accountConfig,
        mainAccountSdkCredProvider,
      );
      accountCredProviders.set(accountConfig.accountId, {
        accountId: accountConfig.accountId,
        stsRegion: accountConfig.region,
        sdkCredentialProvider,
      });
    }

    return new DefaultAwsCredentialsManager(
      accountCredProviders,
      awsConfig.accountDefaults,
      mainAccountCredProvider,
    );
  }

  /**
   * Creates a credentials manager backed by the connections service.
   *
   * @param connections - The connections service used to resolve AWS credentials.
   * @param options - The AWS connection type and resource URL to resolve.
   * @public
   */
  static fromConnections(
    connections: ConnectionsService,
    options: AwsCredentialsManagerConnectionOptions,
  ): DefaultAwsCredentialsManager {
    return new DefaultAwsCredentialsManager(
      new Map(),
      {},
      {
        sdkCredentialProvider: getDefaultCredentialsChain(),
      },
      { connections, options },
    );
  }

  private readonly accountCredentialProviders: Map<
    string,
    AwsCredentialProvider
  >;
  private readonly accountDefaults: AwsIntegrationDefaultAccountConfig;
  private readonly mainAccountCredentialProvider: AwsCredentialProvider;

  private constructor(
    accountCredentialProviders: Map<string, AwsCredentialProvider>,
    accountDefaults: AwsIntegrationDefaultAccountConfig,
    mainAccountCredentialProvider: AwsCredentialProvider,
    private readonly connectionCredentialSource?: AwsConnectionCredentialSource,
  ) {
    this.accountCredentialProviders = accountCredentialProviders;
    this.accountDefaults = accountDefaults;
    this.mainAccountCredentialProvider = mainAccountCredentialProvider;
  }

  /**
   * Returns an {@link AwsCredentialProvider} for a given AWS account.
   *
   * @example
   * ```ts
   * const { provider } = await getCredentialProvider({
   *   accountId: '0123456789012',
   * })
   *
   * const { provider } = await getCredentialProvider({
   *   arn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service'
   * })
   * ```
   *
   * @param opts - the AWS account ID or AWS resource ARN
   * @returns A promise of {@link AwsCredentialProvider}.
   */
  async getCredentialProvider(
    opts?: AwsCredentialProviderOptions,
  ): Promise<AwsCredentialProvider> {
    if (this.connectionCredentialSource) {
      return this.getConnectionCredentialProvider(opts);
    }

    // If no options provided, fall back to the main account
    if (!opts) {
      return this.mainAccountCredentialProvider;
    }

    // Determine the account ID: either explicitly provided or extracted from the provided ARN
    let accountId = opts.accountId;
    if (opts.arn && !accountId) {
      const arnComponents = parse(opts.arn);
      accountId = arnComponents.accountId;
    }

    // If the account ID was not provided (explicitly or in the ARN),
    // fall back to the main account
    if (!accountId) {
      return this.mainAccountCredentialProvider;
    }

    // Return a cached provider if available
    if (this.accountCredentialProviders.has(accountId)) {
      return this.accountCredentialProviders.get(accountId)!;
    }

    // First, fall back to using the account defaults
    if (this.accountDefaults.roleName) {
      const config: AwsIntegrationAccountConfig = {
        accountId,
        roleName: this.accountDefaults.roleName,
        partition: this.accountDefaults.partition,
        region: this.accountDefaults.region,
        externalId: this.accountDefaults.externalId,
        webIdentityTokenFile: this.accountDefaults.webIdentityTokenFile,
      };
      const sdkCredentialProvider = getSdkCredentialProvider(
        config,
        this.mainAccountCredentialProvider.sdkCredentialProvider,
      );
      const credProvider: AwsCredentialProvider = {
        accountId,
        sdkCredentialProvider,
      };
      this.accountCredentialProviders.set(accountId, credProvider);
      return credProvider;
    }

    // Then, fall back to using the main account, but only
    // if the account requested matches the main account ID
    await fillInAccountId(this.mainAccountCredentialProvider);
    if (accountId === this.mainAccountCredentialProvider.accountId) {
      return this.mainAccountCredentialProvider;
    }

    // Otherwise, the account needs to be explicitly configured in Backstage
    throw new Error(
      `There is no AWS integration that matches ${accountId}. Please add a configuration for this AWS account.`,
    );
  }

  private async getConnectionCredentialProvider(
    opts?: AwsCredentialProviderOptions,
  ): Promise<AwsCredentialProvider> {
    const { connections, options } = this.connectionCredentialSource!;
    let connection:
      | Connection<'aws-codecommit', 'accessKey' | 'assumeRole'>
      | Connection<'aws-s3', 'accessKey' | 'assumeRole' | 'none'>;

    if (options.type === 'aws-codecommit') {
      connection = await connections.find({
        type: 'aws-codecommit',
        url: options.url,
        authMethods: ['accessKey', 'assumeRole'],
      });
    } else {
      connection = await connections.find({
        type: 'aws-s3',
        url: options.url,
        authMethods: ['accessKey', 'assumeRole', 'none'],
      });
    }

    const { auth } = connection;
    const requestedAccountId =
      opts?.accountId ?? (opts?.arn ? parse(opts.arn).accountId : undefined);
    let authIdentifier = '';
    if (auth.method === 'accessKey') {
      authIdentifier = auth.accessKeyId;
    } else if (auth.method === 'assumeRole') {
      authIdentifier = auth.roleArn;
    }
    const providerKey = `${connection.type}:${connection.host}:${
      auth.method
    }:${authIdentifier}:${requestedAccountId ?? ''}`;
    const cachedProvider = this.accountCredentialProviders.get(providerKey);
    if (cachedProvider) {
      return cachedProvider;
    }

    let credentialProvider: AwsCredentialProvider;
    if (auth.method === 'accessKey') {
      credentialProvider = {
        accountId: requestedAccountId,
        sdkCredentialProvider: getStaticCredentials(
          auth.accessKeyId,
          auth.secretAccessKey,
        ),
      };
    } else if (auth.method === 'assumeRole') {
      const role = parse(auth.roleArn);
      const stsRegion =
        connection.type === 'aws-codecommit' ? connection.region : undefined;
      credentialProvider = {
        accountId: role.accountId,
        stsRegion,
        sdkCredentialProvider: fromTemporaryCredentials({
          masterCredentials:
            this.mainAccountCredentialProvider.sdkCredentialProvider,
          params: {
            RoleArn: auth.roleArn,
            RoleSessionName: 'backstage',
            ExternalId: auth.externalId,
          },
          clientConfig: {
            region: stsRegion ?? 'us-east-1',
            customUserAgent: 'backstage-aws-credentials-manager',
          },
        }),
      };
    } else {
      credentialProvider = this.mainAccountCredentialProvider;
    }

    this.accountCredentialProviders.set(providerKey, credentialProvider);
    return credentialProvider;
  }
}
