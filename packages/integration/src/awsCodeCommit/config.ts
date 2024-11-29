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

import { Config } from '@backstage/config';

const AMAZON_AWS_CODECOMMIT_HOST = 'console.aws.amazon.com';

/**
 * The configuration parameters for a single AWS CodeCommit provider.
 *
 * @public
 */
export type AwsCodeCommitIntegrationConfig = {
  /**
   * Host, git host derived from region
   */
  host: string;

  /**
   * (Optional) User access key id
   */
  accessKeyId?: string;

  /**
   * (Optional) User secret access key
   */
  secretAccessKey?: string;

  /**
   * (Optional) ARN of role to be assumed
   */
  roleArn?: string;

  /**
   * (Optional) External ID to use when assuming role
   */
  externalId?: string;

  /**
   * region to use for AWS (default: us-east-1)
   */
  region: string;
};

/**
 * Reads a single Aws CodeCommit integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */

export function readAwsCodeCommitIntegrationConfig(
  config: Config,
): AwsCodeCommitIntegrationConfig {
  const accessKeyId = config.getOptionalString('accessKeyId');
  const secretAccessKey = config.getOptionalString('secretAccessKey')?.trim();
  const roleArn = config.getOptionalString('roleArn');
  const externalId = config.getOptionalString('externalId');
  const region = config.getString('region');
  const host =
    config.getOptionalString('host') ||
    `${region}.${AMAZON_AWS_CODECOMMIT_HOST}`;

  return {
    host,
    accessKeyId,
    secretAccessKey,
    roleArn,
    externalId,
    region,
  };
}

/**
 * Reads a set of AWS CodeCommit integration configs, and inserts some defaults for
 * public Amazon AWS if not specified.
 *
 * @param configs - The config objects of the integrations
 * @public
 */
export function readAwsCodeCommitIntegrationConfigs(
  configs: Config[],
): AwsCodeCommitIntegrationConfig[] {
  return configs.map(readAwsCodeCommitIntegrationConfig);
}
