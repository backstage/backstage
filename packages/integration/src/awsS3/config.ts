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

export const AMAZON_AWS_HOST = 'amazonaws.com';

/**
 * The configuration parameters for a single AWS S3 provider.
 *
 * @public
 */
export type AwsS3IntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "amazonaws.com"
   *
   * If validateHost is true, "amazonaws.com" host is enforced. To test with localstack or similar AWS S3 emulators,
   * setting validateHost to false allows hosts like "localhost:4566". Set ssl to false to access emulated S3
   * endpoint over http (vs https). In that case, S3 urls would look like "http://<bucket>.localhost:4566/<path>".
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

  /**
   * validateHost
   */
  validateHost: boolean;

  /**
   * ssl
   */
  ssl: boolean;
};

/**
 * Reads a single Aws S3 integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */

export function readAwsS3IntegrationConfig(
  config: Config,
): AwsS3IntegrationConfig {
  const host = config.getOptionalString('host') ?? AMAZON_AWS_HOST;
  const accessKeyId = config.getOptionalString('accessKeyId');
  const secretAccessKey = config.getOptionalString('secretAccessKey');
  const roleArn = config.getOptionalString('roleArn');
  const validateHost = config.getOptionalBoolean('validateHost') ?? true;
  const ssl = config.getOptionalBoolean('ssl') ?? true;

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid awsS3 integration config, '${host}' is not a valid host`,
    );
  }

  return { host, accessKeyId, secretAccessKey, roleArn, validateHost, ssl };
}

/**
 * Reads a set of AWS S3 integration configs, and inserts some defaults for
 * public Amazon AWS if not specified.
 *
 * @param configs - The config objects of the integrations
 * @public
 */
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
      validateHost: true,
      ssl: true,
    });
  }
  return result;
}
