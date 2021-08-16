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
import { isValidHost } from '../helpers';

const AMAZON_AWS_HOST = 'amazonaws.com';

/**
 * The configuration parameters for a single AWS S3 provider.
 */

export type AwsS3IntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "amazonaws.com"
   *
   * Currently only "amazonaws.com" is supported.
   */
  host: string;

  /**
   * accessKeyId
   */
  accessKeyId?: string;

  /**
   * secretAccessKey
   */
  secretAccessKey?: string;

  /**
   * roleArn
   */
  roleArn?: string;
};

/**
 * Reads a single Aws S3 integration config.
 *
 * @param config The config object of a single integration
 */

export function readAwsS3IntegrationConfig(
  config: Config,
): AwsS3IntegrationConfig {
  const host = config.getOptionalString('host') ?? AMAZON_AWS_HOST;
  const accessKeyId = config.getOptionalString('accessKeyId');
  const secretAccessKey = config.getOptionalString('secretAccessKey');
  const roleArn = config.getOptionalString('roleArn');

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid awsS3 integration config, '${host}' is not a valid host`,
    );
  }

  return { host, accessKeyId, secretAccessKey, roleArn };
}

export function readAwsS3IntegrationConfigs(
  configs: Config[],
): AwsS3IntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readAwsS3IntegrationConfig);

  // If no explicit amazonaws.com integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === AMAZON_AWS_HOST)) {
    result.push({
      host: AMAZON_AWS_HOST,
    });
  }
  return result;
}
