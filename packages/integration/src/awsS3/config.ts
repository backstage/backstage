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

/**
 * The configuration parameters for a single AWS S3 provider.
 */

export type AwsS3IntegrationConfig = {
  /**
   * accessKeyId
   */
  accessKeyId?: string;

  /**
   * secretAccessKey
   */
  secretAccessKey?: string;
};

/**
 * Reads a single Aws S3 integration config.
 *
 * @param config The config object of a single integration
 */

export function readAwsS3IntegrationConfig(
  config: Config,
): AwsS3IntegrationConfig {
  if (!config) {
    return {};
  }

  if (!config.has('accessKeyId') && !config.has('secretAccessKey')) {
    return {};
  }

  const accessKeyId = config.getString('accessKeyId');

  const secretAccessKey = config.getString('secretAccessKey');

  return { accessKeyId: accessKeyId, secretAccessKey: secretAccessKey };
}
