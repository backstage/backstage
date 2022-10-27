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
  AwsCredentials,
  AwsCredentialsProvider,
  AwsCredentialsProviderOptions,
} from './types';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import {
  fromIni,
  fromNodeProviderChain,
  fromTemporaryCredentials,
} from '@aws-sdk/credential-providers';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { parse } from '@aws-sdk/util-arn-parser';
import { Config } from '@backstage/config';

/**
 * Retrieves the account ID for the given credentials provider from STS.
 */
async function fillInAccountId(creds: AwsCredentials) {
  if (creds.accountId) {
    return;
  }

  const client = new STSClient({
    region: creds.stsRegion,
    customUserAgent: 'backstage-aws-credentials-provider',
    credentialDefaultProvider: () => creds.provider,
  });
  const resp = await client.send(new GetCallerIdentityCommand({}));
  creds.accountId = resp.Account!;
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
      customUserAgent: 'backstage-aws-credentials-provider',
    },
  });
}

function getDefaultCredentialsChain(): AwsCredentialIdentityProvider {
  return fromNodeProviderChain();
}

/**
 * Constructs the credential provider needed by the AWS SDK from the given account config
 *
 * Order of precedence:
 * 1. Assume role with static creds
 * 2. Assume role with main account creds
 * 3. Static creds
 * 4. Profile creds
 * 5. Default AWS SDK creds chain
 */
function getAccountCredentialsProvider(
  config: AwsIntegrationAccountConfig,
  mainAccountCreds: AwsCredentialIdentityProvider,
): AwsCredentialIdentityProvider {
  if (config.roleName) {
    const region = config.region ?? 'us-east-1';
    const partition = config.partition ?? 'aws';

    return fromTemporaryCredentials({
      masterCredentials: config.accessKeyId
        ? getStaticCredentials(config.accessKeyId!, config.secretAccessKey!)
        : mainAccountCreds,
      params: {
        RoleArn: `arn:${partition}:iam::${config.accountId}:role/${config.roleName}`,
        RoleSessionName: 'backstage',
        ExternalId: config.externalId,
      },
      clientConfig: {
        region,
        customUserAgent: 'backstage-aws-credentials-provider',
      },
    });
  }

  if (config.accessKeyId) {
    return getStaticCredentials(config.accessKeyId!, config.secretAccessKey!);
  }

  if (config.profile) {
    return getProfileCredentials(config.profile!, config.region);
  }

  return getDefaultCredentialsChain();
}

/**
 * Constructs the credential provider needed by the AWS SDK for the main account
 *
 * Order of precedence:
 * 1. Static creds
 * 2. Profile creds
 * 3. Default AWS SDK creds chain
 */
function getMainAccountCredentialsProvider(
  config: AwsIntegrationMainAccountConfig,
): AwsCredentialIdentityProvider {
  if (config.accessKeyId) {
    return getStaticCredentials(config.accessKeyId!, config.secretAccessKey!);
  }

  if (config.profile) {
    return getProfileCredentials(config.profile!, config.region);
  }

  return getDefaultCredentialsChain();
}

/**
 * Handles the creation and caching of credential providers for AWS accounts.
 *
 * @public
 */
export class DefaultAwsCredentialsProvider implements AwsCredentialsProvider {
  static fromConfig(config: Config): DefaultAwsCredentialsProvider {
    const awsConfig = config.has('aws')
      ? readAwsIntegrationConfig(config.getConfig('aws'))
      : {
          accounts: [],
          mainAccount: {},
          accountDefaults: {},
        };

    const mainAccountProvider = getMainAccountCredentialsProvider(
      awsConfig.mainAccount,
    );
    const mainAccountCreds: AwsCredentials = {
      provider: mainAccountProvider,
    };

    const accountCreds = new Map<string, AwsCredentials>();
    for (const accountConfig of awsConfig.accounts) {
      const provider = getAccountCredentialsProvider(
        accountConfig,
        mainAccountCreds.provider,
      );
      accountCreds.set(accountConfig.accountId, {
        accountId: accountConfig.accountId,
        stsRegion: accountConfig.region,
        provider,
      });
    }

    return new DefaultAwsCredentialsProvider(
      accountCreds,
      awsConfig.accountDefaults,
      mainAccountCreds,
    );
  }

  private constructor(
    private readonly accountCredentials: Map<string, AwsCredentials>,
    private readonly accountDefaults: AwsIntegrationDefaultAccountConfig,
    private readonly mainAccountCredentials: AwsCredentials,
  ) {}

  /**
   * Returns {@link AwsCredentials} for a given AWS account.
   *
   * @example
   * ```ts
   * const { provider } = await getCredentials({
   *   accountId: '0123456789012',
   * })
   *
   * const { provider } = await getCredentials({
   *   arn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service'
   * })
   * ```
   *
   * @param opts - the AWS account ID or AWS resource ARN
   * @returns A promise of {@link AwsCredentials}.
   */
  async getCredentials(
    opts?: AwsCredentialsProviderOptions,
  ): Promise<AwsCredentials> {
    // If no options provided, fall back to the main account
    if (!opts) {
      await fillInAccountId(this.mainAccountCredentials);
      return this.mainAccountCredentials;
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
      await fillInAccountId(this.mainAccountCredentials);
      return this.mainAccountCredentials;
    }

    // Return a cached provider if available
    if (this.accountCredentials.has(accountId)) {
      return this.accountCredentials.get(accountId)!;
    }

    // First, fall back to using the account defaults
    if (this.accountDefaults.roleName) {
      const config: AwsIntegrationAccountConfig = {
        accountId,
        roleName: this.accountDefaults.roleName,
        partition: this.accountDefaults.partition,
        region: this.accountDefaults.region,
        externalId: this.accountDefaults.externalId,
      };
      const provider = getAccountCredentialsProvider(
        config,
        this.mainAccountCredentials.provider,
      );
      const creds: AwsCredentials = { accountId, provider };
      this.accountCredentials.set(accountId, creds);
      return creds;
    }

    // Then, fall back to using the main account, but only
    // if the account requested matches the main account ID
    await fillInAccountId(this.mainAccountCredentials);
    if (accountId === this.mainAccountCredentials.accountId) {
      return this.mainAccountCredentials;
    }

    // Otherwise, the account needs to be explicitly configured in Backstage
    throw new Error(
      `There is no AWS integration that matches ${accountId}. Please add a configuration for this AWS account.`,
    );
  }
}
