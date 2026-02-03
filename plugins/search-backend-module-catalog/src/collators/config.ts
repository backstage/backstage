/*
 * Copyright 2023 The Backstage Authors
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
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';

const configKey = 'search.collators.catalog';

export const defaults = {
  schedule: {
    frequency: { minutes: 10 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: 3 },
  },
  collatorOptions: {
    locationTemplate: '/catalog/:namespace/:kind/:name',
    filter: undefined,
    batchSize: 500,
  },
};

export function readScheduleConfigOptions(
  configRoot: Config,
): SchedulerServiceTaskScheduleDefinition {
  let schedule: SchedulerServiceTaskScheduleDefinition | undefined = undefined;

  const config = configRoot.getOptionalConfig(configKey);
  if (config) {
    const scheduleConfig = config.getOptionalConfig('schedule');
    if (scheduleConfig) {
      try {
        schedule =
          readSchedulerServiceTaskScheduleDefinitionFromConfig(scheduleConfig);
      } catch (error) {
        throw new InputError(`Invalid schedule at ${configKey}, ${error}`);
      }
    }
  }

  return schedule ?? defaults.schedule;
}

export function readCollatorConfigOptions(configRoot: Config): {
  locationTemplate: string;
  filter: EntityFilterQuery | undefined;
  batchSize: number;
} {
  const config = configRoot.getOptionalConfig(configKey);
  if (!config) {
    return defaults.collatorOptions;
  }

  return {
    locationTemplate:
      config.getOptionalString('locationTemplate') ??
      defaults.collatorOptions.locationTemplate,
    filter:
      config.getOptional<EntityFilterQuery>('filter') ??
      defaults.collatorOptions.filter,
    batchSize:
      config.getOptionalNumber('batchSize') ??
      defaults.collatorOptions.batchSize,
  };
}
