/*
 * Copyright 2024 The Backstage Authors
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
import { NotFoundError } from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  Zone,
  ZoneLevel,
  ZoneSchedule,
  OperationalZoneService,
  resolveZoneFromSchedule,
} from '@backstage/plugin-operational-zones-common';

/** @public */
export class DefaultOperationalZoneService implements OperationalZoneService {
  private readonly schedules = new Map<string, ZoneSchedule>();
  private readonly logger: LoggerService;

  static fromConfig(
    config: Config,
    options: { logger: LoggerService },
  ): DefaultOperationalZoneService {
    return new DefaultOperationalZoneService(config, options);
  }

  private constructor(config: Config, options: { logger: LoggerService }) {
    this.logger = options.logger;

    const schedulesConfig =
      config.getOptionalConfigArray('operationalZones.schedules') ?? [];

    for (const sc of schedulesConfig) {
      const operationId = sc.getString('operationId');
      const defaultLevel =
        (sc.getOptionalString('defaultLevel') as ZoneLevel | undefined) ??
        'green';
      const windowsConfig = sc.getConfigArray('windows');
      const windows = windowsConfig.map(wc => ({
        level: wc.getString('level') as ZoneLevel,
        cron: wc.getString('cron'),
        durationMinutes: wc.getNumber('durationMinutes'),
      }));

      this.schedules.set(operationId, {
        operationId,
        defaultLevel,
        windows,
      });

      this.logger.info(`Loaded zone schedule for '${operationId}'`);
    }
  }

  async resolve(operationId: string): Promise<Zone> {
    const schedule = this.schedules.get(operationId);
    if (!schedule) {
      throw new NotFoundError(
        `No zone schedule registered for '${operationId}'`,
      );
    }
    return resolveZoneFromSchedule(schedule);
  }

  register(operationId: string, schedule: ZoneSchedule): void {
    this.schedules.set(operationId, schedule);
    this.logger.info(`Registered zone schedule for '${operationId}'`);
  }

  async listAll(): Promise<Zone[]> {
    const now = new Date();
    return Array.from(this.schedules.values()).map(schedule =>
      resolveZoneFromSchedule(schedule, now),
    );
  }

  async evaluateAll(): Promise<void> {
    const now = new Date();
    for (const schedule of this.schedules.values()) {
      resolveZoneFromSchedule(schedule, now);
    }
    this.logger.debug(`Evaluated ${this.schedules.size} zone schedule(s)`);
  }
}
