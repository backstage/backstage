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

import { Config } from '@backstage/config';

/**
 * The configuration parameters for a single AWS account for the AWS integration.
 *
 * @public
 */
export type AwsIntegrationAccountConfig = {
  /**
   * The account ID of the target account that this matches on, e.g. "123456789012"
   */
  accountId: string;

  /**
   * The access key ID for a set of static AWS credentials
   */
  accessKeyId?: string;

  /**
   * The secret access key for a set of static AWS credentials
   */
  secretAccessKey?: string;

  /**
   * The configuration profile from a credentials file at ~/.aws/credentials and
   * a configuration file at ~/.aws/config.
   */
  profile?: string;

  /**
   * The IAM role to assume to retrieve temporary AWS credentials
   */
  roleName?: string;

  /**
   * The AWS partition of the IAM role, e.g. "aws", "aws-cn"
   */
  partition?: string;

  /**
   * The STS regional endpoint to use when retrieving temporary AWS credentials, e.g. "ap-northeast-1"
   */
  region?: string;

  /**
   * The unique identifier needed to assume the role to retrieve temporary AWS credentials
   */
  externalId?: string;
};

/**
 * The configuration parameters for the main AWS account for the AWS integration.
 *
 * @public
 */
export type AwsIntegrationMainAccountConfig = {
  /**
   * The access key ID for a set of static AWS credentials
   */
  accessKeyId?: string;

  /**
   * The secret access key for a set of static AWS credentials
   */
  secretAccessKey?: string;

  /**
   * The configuration profile from a credentials file at ~/.aws/credentials and
   * a configuration file at ~/.aws/config.
   */
  profile?: string;

  /**
   * The STS regional endpoint to use for the main account, e.g. "ap-northeast-1"
   */
  region?: string;
};

/**
 * The default configuration parameters to use for accounts for the AWS integration.
 *
 * @public
 */
export type AwsIntegrationDefaultAccountConfig = {
  /**
   * The IAM role to assume to retrieve temporary AWS credentials
   */
  roleName?: string;

  /**
   * The AWS partition of the IAM role, e.g. "aws", "aws-cn"
   */
  partition?: string;

  /**
   * The STS regional endpoint to use when retrieving temporary AWS credentials, e.g. "ap-northeast-1"
   */
  region?: string;

  /**
   * The unique identifier needed to assume the role to retrieve temporary AWS credentials
   */
  externalId?: string;
};

/**
 * The configuration parameters for AWS account integration.
 *
 * @public
 */
export type AwsIntegrationConfig = {
  /**
   * Configuration for retrieving AWS accounts credentials
   */
  accounts: AwsIntegrationAccountConfig[];

  /**
   * Defaults for retrieving AWS account credentials
   */
  accountDefaults: AwsIntegrationDefaultAccountConfig;

  /**
   * Main account to use for retrieving AWS account credentials
   */
  mainAccount: AwsIntegrationMainAccountConfig;
};

/**
 * Reads an AWS integration account config.
 *
 * @param config - The config object of a single account
 */
function readAwsIntegrationAccountConfig(
  config: Config,
): AwsIntegrationAccountConfig {
  const accountConfig = {
    accountId: config.getString('accountId'),
    accessKeyId: config.getOptionalString('accessKeyId'),
    secretAccessKey: config.getOptionalString('secretAccessKey'),
    profile: config.getOptionalString('profile'),
    roleName: config.getOptionalString('roleName'),
    region: config.getOptionalString('region'),
    partition: config.getOptionalString('partition'),
    externalId: config.getOptionalString('externalId'),
  };

  // Validate that the account config has the right combination of attributes
  if (accountConfig.accessKeyId && !accountConfig.secretAccessKey) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has an access key ID configured, but no secret access key.`,
    );
  }

  if (!accountConfig.accessKeyId && accountConfig.secretAccessKey) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has a secret access key configured, but no access key ID`,
    );
  }

  if (accountConfig.profile && accountConfig.accessKeyId) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has both an access key ID and a profile configured, but only one must be specified`,
    );
  }

  if (accountConfig.profile && accountConfig.roleName) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has both an access key ID and a role name configured, but only one must be specified`,
    );
  }

  if (!accountConfig.roleName && accountConfig.externalId) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has an external ID configured, but no role name.`,
    );
  }

  if (!accountConfig.roleName && accountConfig.region) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has an STS region configured, but no role name.`,
    );
  }

  if (!accountConfig.roleName && accountConfig.partition) {
    throw new Error(
      `AWS integration account ${accountConfig.accountId} has an IAM partition configured, but no role name.`,
    );
  }

  return accountConfig;
}

/**
 * Reads the main AWS integration account config.
 *
 * @param config - The config object of the main account
 */
function readMainAwsIntegrationAccountConfig(
  config: Config,
): AwsIntegrationMainAccountConfig {
  const mainAccountConfig = {
    accessKeyId: config.getOptionalString('accessKeyId'),
    secretAccessKey: config.getOptionalString('secretAccessKey'),
    profile: config.getOptionalString('profile'),
    region: config.getOptionalString('region'),
  };

  // Validate that the account config has the right combination of attributes
  if (mainAccountConfig.accessKeyId && !mainAccountConfig.secretAccessKey) {
    throw new Error(
      `The main AWS integration account has an access key ID configured, but no secret access key.`,
    );
  }

  if (!mainAccountConfig.accessKeyId && mainAccountConfig.secretAccessKey) {
    throw new Error(
      `The main AWS integration account has a secret access key configured, but no access key ID`,
    );
  }

  if (mainAccountConfig.profile && mainAccountConfig.accessKeyId) {
    throw new Error(
      `The main AWS integration account has both an access key ID and a profile configured, but only one must be specified`,
    );
  }

  return mainAccountConfig;
}

/**
 * Reads the default settings for retrieving credentials from AWS integration accounts.
 *
 * @param config - The config object of the default account settings
 */
function readAwsIntegrationAccountDefaultsConfig(
  config: Config,
): AwsIntegrationDefaultAccountConfig {
  const defaultAccountConfig = {
    roleName: config.getOptionalString('roleName'),
    partition: config.getOptionalString('partition'),
    region: config.getOptionalString('region'),
    externalId: config.getOptionalString('externalId'),
  };

  // Validate that the account config has the right combination of attributes
  if (!defaultAccountConfig.roleName && defaultAccountConfig.externalId) {
    throw new Error(
      `AWS integration account default configuration has an external ID configured, but no role name.`,
    );
  }

  if (!defaultAccountConfig.roleName && defaultAccountConfig.region) {
    throw new Error(
      `AWS integration account default configuration has an STS region configured, but no role name.`,
    );
  }

  if (!defaultAccountConfig.roleName && defaultAccountConfig.partition) {
    throw new Error(
      `AWS integration account default configuration has an IAM partition configured, but no role name.`,
    );
  }

  return defaultAccountConfig;
}

/**
 * Reads an AWS integration configuration
 *
 * @param config - the integration config object
 * @public
 */
export function readAwsIntegrationConfig(config: Config): AwsIntegrationConfig {
  const accounts = config
    .getOptionalConfigArray('accounts')
    ?.map(readAwsIntegrationAccountConfig);
  const mainAccount = config.has('mainAccount')
    ? readMainAwsIntegrationAccountConfig(config.getConfig('mainAccount'))
    : {};
  const accountDefaults = config.has('accountDefaults')
    ? readAwsIntegrationAccountDefaultsConfig(
        config.getConfig('accountDefaults'),
      )
    : {};

  return {
    accounts: accounts ?? [],
    mainAccount,
    accountDefaults,
  };
}
