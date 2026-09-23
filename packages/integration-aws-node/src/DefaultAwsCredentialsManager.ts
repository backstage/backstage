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
import { isError } from '@backstage/errors';

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
 * Looks up the aws connection, treating "not found" as an unconfigured
 * connection rather than an error so that the legacy fallbacks apply.
 */
async function findAwsConnection(
  connections: ConnectionsService,
  query: { accountId?: string },
): Promise<Connection<'aws', 'account'> | undefined> {
  try {
    return await connections.find({
      type: 'aws',
      query,
      authMethods: ['account'],
    });
  } catch (e) {
    if (isError(e) && e.name === 'NotFoundError') {
      return undefined;
    }
    throw e;
  }
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
   * @internal
   */
  static experimentalFromConnections(
    connections: ConnectionsService,
  ): DefaultAwsCredentialsManager {
    return new DefaultAwsCredentialsManager(
      new Map(),
      {},
      // Used when the connection declares no mainAccount entry, matching the
      // implicit main account of a config without a mainAccount block.
      { sdkCredentialProvider: getDefaultCredentialsChain() },
      connections,
    );
  }

  private readonly accountCredentialProviders: Map<
    string,
    AwsCredentialProvider
  >;
  private readonly accountDefaults: AwsIntegrationDefaultAccountConfig;
  private readonly mainAccountCredentialProvider: AwsCredentialProvider;
  private readonly connections?: ConnectionsService;
  private mainAccountProviderFromConnections?: Promise<AwsCredentialProvider>;

  private constructor(
    accountCredentialProviders: Map<string, AwsCredentialProvider>,
    accountDefaults: AwsIntegrationDefaultAccountConfig,
    mainAccountCredentialProvider: AwsCredentialProvider,
    connections?: ConnectionsService,
  ) {
    this.accountCredentialProviders = accountCredentialProviders;
    this.accountDefaults = accountDefaults;
    this.mainAccountCredentialProvider = mainAccountCredentialProvider;
    this.connections = connections;
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
    if (this.connections) {
      return this.getCredentialProviderFromConnections(this.connections, opts);
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

  // Resolves the fallback credentials once and caches them: the mainAccount
  // entry when the connection declares one, or the environment's default
  // credentials chain.
  private getMainAccountProviderFromConnections(
    connections: ConnectionsService,
  ): Promise<AwsCredentialProvider> {
    this.mainAccountProviderFromConnections ??= (async () => {
      const connection = await findAwsConnection(connections, {});
      if (!connection) {
        return this.mainAccountCredentialProvider;
      }
      return {
        accountId: connection.auth.accountId,
        stsRegion: connection.auth.region,
        sdkCredentialProvider: getMainAccountSdkCredentialProvider(
          connection.auth,
        ),
      };
    })();
    return this.mainAccountProviderFromConnections;
  }

  private async getCredentialProviderFromConnections(
    connections: ConnectionsService,
    opts?: AwsCredentialProviderOptions,
  ): Promise<AwsCredentialProvider> {
    // Determine the account ID: either explicitly provided or extracted from the provided ARN
    let accountId = opts?.accountId;
    if (opts?.arn && !accountId) {
      const arnComponents = parse(opts.arn);
      accountId = arnComponents.accountId;
    }

    // If the account ID was not provided (explicitly or in the ARN),
    // fall back to the main account
    if (!accountId) {
      return this.getMainAccountProviderFromConnections(connections);
    }

    // Return a cached provider if available
    if (this.accountCredentialProviders.has(accountId)) {
      return this.accountCredentialProviders.get(accountId)!;
    }

    const connection = await findAwsConnection(connections, { accountId });
    const mainProvider = await this.getMainAccountProviderFromConnections(
      connections,
    );

    // An entry matched by account ID is used exactly as written
    if (connection && connection.auth.accountId === accountId) {
      const credProvider: AwsCredentialProvider = {
        accountId,
        stsRegion: connection.auth.region,
        sdkCredentialProvider: getSdkCredentialProvider(
          { ...connection.auth, accountId },
          mainProvider.sdkCredentialProvider,
        ),
      };
      this.accountCredentialProviders.set(accountId, credProvider);
      return credProvider;
    }

    // The connection-level roleName is the role to assume in any account
    // without an entry of its own, using main account credentials
    if (connection?.roleName) {
      const sdkCredentialProvider = getSdkCredentialProvider(
        {
          accountId,
          roleName: connection.roleName,
          partition: connection.partition,
          region: connection.region,
          externalId: connection.externalId,
          webIdentityTokenFile: connection.webIdentityTokenFile,
        },
        mainProvider.sdkCredentialProvider,
      );
      const credProvider: AwsCredentialProvider = {
        accountId,
        sdkCredentialProvider,
      };
      this.accountCredentialProviders.set(accountId, credProvider);
      return credProvider;
    }

    // Then, fall back to the main account, but only
    // if the account requested matches the main account ID
    await fillInAccountId(mainProvider);
    if (accountId === mainProvider.accountId) {
      return mainProvider;
    }

    // Otherwise, the account needs to be explicitly configured in Backstage
    throw new Error(
      `There is no AWS integration that matches ${accountId}. Please add a configuration for this AWS account.`,
    );
  }
}
