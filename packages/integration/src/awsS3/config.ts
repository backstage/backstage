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

const AMAZON_AWS_HOST = 'amazonaws.com';

/**
 * The configuration parameters for a single AWS S3 provider.
 *
 * @public
 */
export type AwsS3IntegrationConfig = {
  /**
   * Host, derived from endpoint, and defaults to amazonaws.com
   */
  host: string;

  /**
   * (Optional) AWS Endpoint.
   * The endpoint URI to send requests to. The default endpoint is built from the configured region.
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
   *
   * Supports non-AWS providers, e.g. for LocalStack, endpoint may look like http://localhost:4566
   */
  endpoint?: string;

  /**
   * (Optional) Whether to use path style URLs when communicating with S3.
   * Defaults to false.
   * This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used.
   */
  s3ForcePathStyle?: boolean;

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
  const endpoint = config.getOptionalString('endpoint');
  const s3ForcePathStyle =
    config.getOptionalBoolean('s3ForcePathStyle') ?? false;
  let host;
  let pathname;
  if (endpoint) {
    try {
      const url = new URL(endpoint);
      host = url.host;
      pathname = url.pathname;
    } catch {
      throw new Error(
        `invalid awsS3 integration config, endpoint '${endpoint}' is not a valid URL`,
      );
    }
    if (pathname !== '/') {
      throw new Error(
        `invalid awsS3 integration config, endpoints cannot contain path, got '${endpoint}'`,
      );
    }
  } else {
    host = AMAZON_AWS_HOST;
  }

  const accessKeyId = config.getOptionalString('accessKeyId');
  const secretAccessKey = config.getOptionalString('secretAccessKey');
  const roleArn = config.getOptionalString('roleArn');
  const externalId = config.getOptionalString('externalId');

  return {
    host,
    endpoint,
    s3ForcePathStyle,
    accessKeyId,
    secretAccessKey,
    roleArn,
    externalId,
  };
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
    });
  }
  return result;
}
