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

import { ConfigReader } from '@backstage/config';
import { HumanDuration } from '@backstage/types';
import { Duration } from 'luxon';
import { readSchedulerServiceTaskScheduleDefinitionFromConfig } from './SchedulerService';

describe('readSchedulerServiceTaskScheduleDefinitionFromConfig', () => {
  it('all valid values', () => {
    const config = new ConfigReader({
      frequency: {
        cron: '0 30 * * * *',
      },
      timeout: 'PT3M',
      initialDelay: {
        minutes: 20,
      },
      scope: 'global',
    });

    const result = readSchedulerServiceTaskScheduleDefinitionFromConfig(config);

    expect((result.frequency as { cron: string }).cron).toBe('0 30 * * * *');
    expect(result.timeout).toEqual(Duration.fromISO('PT3M'));
    expect((result.initialDelay as HumanDuration).minutes).toEqual(20);
    expect(result.scope).toBe('global');
  });

  it('all valid required values', () => {
    const config = new ConfigReader({
      frequency: {
        cron: '0 30 * * * *',
      },
      timeout: 'PT3M',
    });

    const result = readSchedulerServiceTaskScheduleDefinitionFromConfig(config);

    expect((result.frequency as { cron: string }).cron).toBe('0 30 * * * *');
    expect(result.timeout).toEqual(Duration.fromISO('PT3M'));
    expect(result.initialDelay).toBeUndefined();
    expect(result.scope).toBeUndefined();
  });

  it('fail without required frequency', () => {
    const config = new ConfigReader({
      timeout: 'PT3M',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow("Missing required config value at 'frequency'");
  });

  it('fail without required timeout', () => {
    const config = new ConfigReader({
      frequency: 'PT30M',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow("Missing required config value at 'timeout'");
  });

  it('invalid frequency key', () => {
    const config = new ConfigReader({
      frequency: {
        invalid: 'value',
      },
      timeout: 'PT3M',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow(
      "Failed to read duration from config at 'frequency', Error: Needs one or more of 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'",
    );
  });

  it('invalid frequency value', () => {
    const config = new ConfigReader({
      frequency: {
        minutes: 'value',
      },
      timeout: 'PT3M',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow(
      "Failed to read duration from config, Error: Unable to convert config value for key 'frequency.minutes' in 'mock-config' to a number",
    );
  });

  it('frequency value with additional invalid prop', () => {
    const config = new ConfigReader({
      frequency: {
        minutes: 20,
        invalid: 'value',
      },
      timeout: 'PT3M',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow(
      "Failed to read duration from config at 'frequency', Error: Unknown property 'invalid'; expected one or more of 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'",
    );
  });

  it('invalid scope value', () => {
    const config = new ConfigReader({
      frequency: {
        years: 2,
      },
      timeout: 'PT3M',
      scope: 'invalid',
    });

    expect(() =>
      readSchedulerServiceTaskScheduleDefinitionFromConfig(config),
    ).toThrow(
      'Only "global" or "local" are allowed for TaskScheduleDefinition.scope, but got: invalid',
    );
  });
});
