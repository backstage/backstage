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

import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import { DefaultOperationalZoneService } from './DefaultOperationalZoneService';

describe('DefaultOperationalZoneService', () => {
  const logger = mockServices.logger.mock();

  it('reads schedules from config', async () => {
    const config = new ConfigReader({
      operationalZones: {
        schedules: [
          {
            operationId: 'test-deploy',
            defaultLevel: 'green',
            windows: [
              { level: 'red', cron: '0 8 * * 1-5', durationMinutes: 600 },
            ],
          },
        ],
      },
    });

    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });
    const zones = await service.listAll();

    expect(zones).toHaveLength(1);
    expect(zones[0].id).toBe('test-deploy');
  });

  it('resolves a registered zone', async () => {
    const config = new ConfigReader({
      operationalZones: {
        schedules: [
          {
            operationId: 'my-op',
            defaultLevel: 'yellow',
            windows: [],
          },
        ],
      },
    });

    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });
    const zone = await service.resolve('my-op');

    expect(zone.id).toBe('my-op');
    expect(zone.level).toBe('yellow');
  });

  it('throws NotFoundError for unknown operationId', async () => {
    const config = new ConfigReader({});
    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });

    await expect(service.resolve('nonexistent')).rejects.toThrow(
      /No zone schedule registered/,
    );
  });

  it('supports runtime registration via register()', async () => {
    const config = new ConfigReader({});
    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });

    service.register('runtime-op', {
      operationId: 'runtime-op',
      defaultLevel: 'red',
      windows: [],
    });

    const zone = await service.resolve('runtime-op');
    expect(zone.id).toBe('runtime-op');
    expect(zone.level).toBe('red');

    const all = await service.listAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('runtime-op');
  });

  it('evaluateAll runs without error', async () => {
    const config = new ConfigReader({
      operationalZones: {
        schedules: [
          {
            operationId: 'eval-test',
            windows: [
              { level: 'yellow', cron: '0 0 * * *', durationMinutes: 60 },
            ],
          },
        ],
      },
    });

    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });

    await expect(service.evaluateAll()).resolves.not.toThrow();
  });

  it('handles empty config gracefully', async () => {
    const config = new ConfigReader({});
    const service = DefaultOperationalZoneService.fromConfig(config, {
      logger,
    });

    const zones = await service.listAll();
    expect(zones).toEqual([]);
  });
});
