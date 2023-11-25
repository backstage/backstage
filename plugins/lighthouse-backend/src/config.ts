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
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  TaskScheduleDefinition,
  readTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-tasks';
import { Config, readDurationFromConfig } from '@backstage/config';
import { HumanDuration } from '@backstage/types';

type Options = {
  logger: LoggerService;
};

/** @public */
export class LighthouseAuditScheduleImpl implements TaskScheduleDefinition {
  /**
   * Looks at the `lighthouse.schedule` section in the application configuration
   * and returns a TaskScheduleDefinition.
   * Defaults to `{ frequency: { days: 1 }, timeout: {}, initialDelay: { minutes; 15 } }`
   *
   * @returns a TaskScheduleDefinition
   */
  static fromConfig(config: Config, options: Options): TaskScheduleDefinition {
    const { logger } = options;

    let lighthouse: TaskScheduleDefinition = {
      frequency: { days: 1 },
      timeout: { minutes: 10 },
      initialDelay: { minutes: 15 },
    };

    if (config.has('lighthouse.schedule.frequency')) {
      lighthouse = readTaskScheduleDefinitionFromConfig(
        config.getConfig('lighthouse.schedule'),
      );
    } else if (config.has('lighthouse.schedule')) {
      logger.warn(
        `[Deprecation] Please migrate the schedule configuration to 'lighthouse.schedule.frequency'`,
      );

      lighthouse.frequency = readDurationFromConfig(
        config.getConfig('lighthouse.schedule'),
      );
    }

    if (config.has('lighthouse.timeout')) {
      logger.warn(
        `[Deprecation] Please migrate the timeout configuration to 'lighthouse.schedule.timeout'`,
      );

      lighthouse.timeout = readDurationFromConfig(
        config.getConfig('lighthouse.timeout'),
      );
    }

    return lighthouse;
  }

  constructor(
    public frequency: HumanDuration,
    public timeout: HumanDuration,
    public initialDelay: HumanDuration,
  ) {}
}
