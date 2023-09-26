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

import { Config, readDurationFromConfig } from '@backstage/config';
import { HumanDuration } from '@backstage/types';
import { TaskScheduleDefinition } from './types';
import { Duration } from 'luxon';

function readDuration(config: Config, key: string): Duration | HumanDuration {
  if (typeof config.get(key) === 'string') {
    const value = config.getString(key);
    const duration = Duration.fromISO(value);
    if (!duration.isValid) {
      throw new Error(`Invalid duration: ${value}`);
    }
    return duration;
  }

  return readDurationFromConfig(config, { key });
}

function readCronOrDuration(
  config: Config,
  key: string,
): { cron: string } | Duration | HumanDuration {
  const value = config.get(key);
  if (typeof value === 'object' && (value as { cron?: string }).cron) {
    return value as { cron: string };
  }

  return readDuration(config, key);
}

/**
 * Reads a TaskScheduleDefinition from a Config.
 * Expects the config not to be the root config,
 * but the config for the definition.
 *
 * @param config - config for a TaskScheduleDefinition.
 * @public
 */
export function readTaskScheduleDefinitionFromConfig(
  config: Config,
): TaskScheduleDefinition {
  const frequency = readCronOrDuration(config, 'frequency');
  const timeout = readDuration(config, 'timeout');

  const initialDelay = config.has('initialDelay')
    ? readDuration(config, 'initialDelay')
    : undefined;

  const scope = config.getOptionalString('scope');
  if (scope && !['global', 'local'].includes(scope)) {
    throw new Error(
      `Only "global" or "local" are allowed for TaskScheduleDefinition.scope, but got: ${scope}`,
    );
  }

  return {
    frequency,
    timeout,
    initialDelay,
    scope: scope as 'global' | 'local' | undefined,
  };
}
