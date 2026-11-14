/*
 * Copyright 2026 The Backstage Authors
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

import { DefaultTelemetryRegistryService } from './DefaultTelemetryRegistryService';

describe('DefaultTelemetryRegistryService', () => {
  it('records metric definitions and replaces duplicates', async () => {
    const registry = DefaultTelemetryRegistryService.create();

    registry.registerMetric({
      pluginId: 'catalog',
      name: 'catalog.entities',
      type: 'gauge',
    });
    registry.registerMetric({
      pluginId: 'scaffolder',
      name: 'scaffolder.runs',
      type: 'counter',
      description: 'Task runs',
      unit: '{run}',
    });
    registry.registerMetric({
      pluginId: 'catalog',
      name: 'catalog.entities',
      type: 'observableGauge',
      description: 'Entity count',
    });

    const { metrics } = await registry.listMetrics();
    expect(metrics).toEqual([
      {
        pluginId: 'catalog',
        name: 'catalog.entities',
        type: 'observableGauge',
        description: 'Entity count',
      },
      {
        pluginId: 'scaffolder',
        name: 'scaffolder.runs',
        type: 'counter',
        description: 'Task runs',
        unit: '{run}',
      },
    ]);

    metrics.pop();
    expect((await registry.listMetrics()).metrics).toHaveLength(2);
  });

  it('counts spans per plugin and name, and caps the number of entries', async () => {
    jest.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') });
    try {
      const registry = DefaultTelemetryRegistryService.create({ maxSpans: 2 });

      registry.registerSpan({
        pluginId: 'catalog',
        name: 'refresh',
        kind: 'internal',
      });
      jest.setSystemTime(new Date('2026-01-01T00:01:00Z'));
      registry.registerSpan({
        pluginId: 'catalog',
        name: 'refresh',
        kind: 'internal',
      });
      registry.registerSpan({
        pluginId: 'auth',
        name: 'refresh',
        kind: 'server',
      });
      registry.registerSpan({
        pluginId: 'auth',
        name: 'overflow',
        kind: 'client',
      });

      const { spans } = await registry.listSpans();
      expect(spans).toEqual([
        {
          pluginId: 'auth',
          name: 'refresh',
          kind: 'server',
          count: 1,
          lastSeen: '2026-01-01T00:01:00.000Z',
        },
        {
          pluginId: 'catalog',
          name: 'refresh',
          kind: 'internal',
          count: 2,
          lastSeen: '2026-01-01T00:01:00.000Z',
        },
      ]);
    } finally {
      jest.useRealTimers();
    }
  });
});
