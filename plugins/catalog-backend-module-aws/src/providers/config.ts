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

import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { AwsS3Config } from './types';

const DEFAULT_PROVIDER_ID = 'default';

export function readAwsS3Configs(config: Config): AwsS3Config[] {
  const configs: AwsS3Config[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.awsS3');
  if (!providerConfigs) {
    return configs;
  }

  if (providerConfigs.has('bucketName')) {
    // simple/single config variant
    configs.push(readAwsS3Config(DEFAULT_PROVIDER_ID, providerConfigs));

    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readAwsS3Config(id, providerConfigs.getConfig(id)));
  }

  return configs;
}

function readAwsS3Config(id: string, config: Config): AwsS3Config {
  const bucketName = config.getString('bucketName');
  const region = config.getOptionalString('region');
  const prefix = config.getOptionalString('prefix');

  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;

  return {
    id,
    bucketName,
    region,
    prefix,
    schedule,
  };
}
