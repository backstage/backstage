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
import { HumanDuration as HumanDuration } from '@backstage/types';

export interface LighthouseAuditScheduleConfig {
  schedule: HumanDuration;
  timeout: HumanDuration;
  auditDetail: HumanDuration;
}

/** @public */
export type LighthouseAuditSchedule = {
  getSchedule: () => HumanDuration;
  getTimeout: () => HumanDuration;
};

/** @public */
export class LighthouseAuditScheduleImpl implements LighthouseAuditSchedule {
  static fromConfig(config: Config) {
    const lighthouse = config.getOptionalConfig('lighthouse');

    let schedule: HumanDuration = { days: 1 };
    let timeout: HumanDuration = {};

    if (lighthouse) {
      const scheduleConfig = lighthouse.getOptionalConfig('schedule');
      const timeoutConfig = lighthouse.getOptionalConfig('timeout');

      if (scheduleConfig) {
        schedule = scheduleConfig as HumanDuration;
      }

      if (timeoutConfig) {
        timeout = timeoutConfig as HumanDuration;
      }
    }

    return new LighthouseAuditScheduleImpl(schedule, timeout);
  }

  constructor(
    private schedule: HumanDuration,
    private timeout: HumanDuration,
  ) {}

  getSchedule(): HumanDuration {
    return this.schedule;
  }

  getTimeout(): HumanDuration {
    return this.timeout;
  }
}
