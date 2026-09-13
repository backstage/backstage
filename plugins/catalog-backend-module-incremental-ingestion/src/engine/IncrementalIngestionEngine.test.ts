/*
 * Copyright 2025 The Backstage Authors
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

import { IncrementalIngestionEngine } from './IncrementalIngestionEngine';
import { IterationEngineOptions } from '../types';
import { performance } from 'node:perf_hooks';
import { TestDatabases } from '@backstage/backend-test-utils';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { IncrementalIngestionDatabaseManager } from '../database/IncrementalIngestionDatabaseManager';

jest.mock('node:perf_hooks', () => ({
  performance: {
    now: jest.fn(),
  },
}));

const mockPerformanceNow = performance.now as jest.MockedFunction<
  typeof performance.now
>;

describe('IncrementalIngestionEngine - Burst Length', () => {
  const createMockProvider = () => ({
    getProviderName: jest.fn().mockReturnValue('test-provider'),
    next: jest.fn(),
    around: jest.fn(),
  });

  const createMockManager = () =>
    ({
      getLastMark: jest.fn().mockResolvedValue(null),
      createMark: jest.fn().mockResolvedValue(undefined),
      createMarkEntities: jest.fn().mockResolvedValue(undefined),
      countMarkedEntities: jest.fn().mockResolvedValue(0),
      findStaleEntities: jest.fn().mockResolvedValue([]),
      deleteEntityRecordsByRef: jest.fn().mockResolvedValue(undefined),
    } as any);

  const createMockConnection = () =>
    ({
      applyMutation: jest.fn().mockResolvedValue(undefined),
      refresh: jest.fn().mockResolvedValue(undefined),
    } as any);

  const createMockLogger = () =>
    ({
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      child: jest.fn().mockReturnThis(),
    } as any);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should respect burst length and stop burst when time limit exceeded', async () => {
    const mockProvider = createMockProvider();
    const mockManager = createMockManager();
    const mockConnection = createMockConnection();
    const mockLogger = createMockLogger();

    const options: IterationEngineOptions = {
      provider: mockProvider,
      manager: mockManager,
      connection: mockConnection,
      burstLength: { milliseconds: 100 },
      restLength: { minutes: 1 },
      logger: mockLogger,
      ready: Promise.resolve(),
      metrics: metricsServiceMock.mock(),
    };

    const engine = new IncrementalIngestionEngine(options);

    let callCount = 0;
    // Simulate time advancing: start at 1000, each call advances 40ms
    let currentTime = 1000;
    mockPerformanceNow.mockImplementation(() => currentTime);

    mockProvider.around.mockImplementation(async fn => {
      await fn({});
    });

    mockProvider.next.mockImplementation(async () => {
      callCount++;
      currentTime += 40;
      return {
        done: false,
        entities: [
          {
            entity: {
              kind: 'Component',
              metadata: { name: `test-component-${callCount}` },
            },
          },
        ],
        cursor: `cursor-${callCount}`,
      };
    });

    const signal = new AbortController().signal;

    const result = await engine.ingestOneBurst('test-ingestion', signal);

    // Call 1: time=1040, elapsed=40 < 100 → continue
    // Call 2: time=1080, elapsed=80 < 100 → continue
    // Call 3: time=1120, elapsed=120 > 100 → stop
    expect(result).toBe(false);
    expect(mockProvider.next).toHaveBeenCalledTimes(3);
    expect(callCount).toBe(3);
  });

  it('should complete burst normally when provider returns done before burst length', async () => {
    const mockProvider = createMockProvider();
    const mockManager = createMockManager();
    const mockConnection = createMockConnection();
    const mockLogger = createMockLogger();

    const options: IterationEngineOptions = {
      provider: mockProvider,
      manager: mockManager,
      connection: mockConnection,
      burstLength: { seconds: 10 },
      restLength: { minutes: 1 },
      logger: mockLogger,
      ready: Promise.resolve(),
      metrics: metricsServiceMock.mock(),
    };

    const engine = new IncrementalIngestionEngine(options);

    const currentTime = 1000;
    mockPerformanceNow.mockImplementation(() => currentTime);

    mockProvider.around.mockImplementation(async fn => {
      await fn({});
    });

    mockProvider.next.mockResolvedValueOnce({
      done: true,
      entities: [
        {
          entity: {
            kind: 'Component',
            metadata: { name: 'test-component-1' },
          },
        },
      ],
      cursor: 'final-cursor',
    });

    const signal = new AbortController().signal;
    const result = await engine.ingestOneBurst('test-ingestion', signal);

    expect(result).toBe(true);
    expect(mockProvider.next).toHaveBeenCalledTimes(1);
  });

  it('should stop burst when time limit is reached', async () => {
    const mockProvider = createMockProvider();
    const mockManager = createMockManager();
    const mockConnection = createMockConnection();
    const mockLogger = createMockLogger();

    const options: IterationEngineOptions = {
      provider: mockProvider,
      manager: mockManager,
      connection: mockConnection,
      burstLength: { milliseconds: 80 },
      restLength: { minutes: 1 },
      logger: mockLogger,
      ready: Promise.resolve(),
      metrics: metricsServiceMock.mock(),
    };

    const engine = new IncrementalIngestionEngine(options);

    let callCount = 0;
    // Simulate time advancing: start at 1000, each call advances 30ms
    let currentTime = 1000;
    mockPerformanceNow.mockImplementation(() => currentTime);

    mockProvider.around.mockImplementation(async fn => {
      await fn({});
    });

    mockProvider.next.mockImplementation(async () => {
      callCount++;
      currentTime += 30;
      return {
        done: false,
        entities: [
          {
            entity: {
              kind: 'Component',
              metadata: { name: `test-component-${callCount}` },
            },
          },
        ],
        cursor: `cursor-${callCount}`,
      };
    });

    const signal = new AbortController().signal;

    const result = await engine.ingestOneBurst('test-ingestion', signal);

    // Call 1: time=1030, elapsed=30 < 80 → continue
    // Call 2: time=1060, elapsed=60 < 80 → continue
    // Call 3: time=1090, elapsed=90 > 80 → stop
    expect(result).toBe(false);
    expect(mockProvider.next).toHaveBeenCalledTimes(3);
    expect(callCount).toBe(3);
  });
});

describe('IncrementalIngestionEngine - multi-cycle removal', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_18', 'POSTGRES_14', 'SQLITE_3'],
  });

  const migrationsDir = `${__dirname}/../../migrations`;

  jest.setTimeout(60_000);

  const makeEntity = (name: string): DeferredEntity => ({
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { namespace: 'default', name },
    },
  });

  const refFor = (name: string) => stringifyEntityRef(makeEntity(name).entity);

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    it('detects a stale entity as removable even after the cycle that first missed it had its bookkeeping cleared', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const providerName = 'test-provider';
      const manager = new IncrementalIngestionDatabaseManager({
        client: knex,
      });
      const mockConnection = {
        applyMutation: jest.fn().mockResolvedValue(undefined),
        refresh: jest.fn(),
      } as any;
      const mockLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        child: jest.fn().mockReturnThis(),
      } as any;

      let currentTime = 0;
      mockPerformanceNow.mockImplementation(() => {
        currentTime += 1;
        return currentTime;
      });

      // `active_entities` is this module's own table, kept in sync by the
      // engine itself (via the manager) in the same transaction as its
      // mark/removal bookkeeping — no need to simulate the host catalog.
      const currentCatalogRefs = async () =>
        new Set(
          (
            await knex('active_entities')
              .select('entity_ref')
              .where('source_key', providerName)
          ).map((row: { entity_ref: string }) => row.entity_ref),
        );

      const runCycle = async (
        names: string[],
        rejectRemovalsAbovePercentage?: number,
      ) => {
        const provider = {
          getProviderName: () => providerName,
          around: (burst: (context: unknown) => Promise<void>) => burst({}),
          next: jest.fn().mockResolvedValueOnce({
            done: true,
            entities: names.map(makeEntity),
            cursor: undefined,
          }),
        };

        const options: IterationEngineOptions = {
          provider: provider as any,
          manager,
          connection: mockConnection,
          burstLength: { seconds: 10 },
          restLength: { milliseconds: 0 },
          logger: mockLogger,
          ready: Promise.resolve(),
          metrics: metricsServiceMock.mock(),
          rejectRemovalsAbovePercentage,
        };
        const engine = new IncrementalIngestionEngine(options);
        const signal = new AbortController().signal;

        await engine.handleNextAction(signal); // creates ingestion record
        await engine.handleNextAction(signal); // ingest burst -> resting
        // Advance past the rest period and clear bookkeeping for the
        // completed cycle, exactly like a real `rest` -> next-cycle
        // transition would.
        await manager.clearFinishedIngestions(providerName);
      };

      // Cycle 1: establish comp1, comp2, comp3 as the provider's entities.
      await runCycle(['comp1', 'comp2', 'comp3']);
      expect(await currentCatalogRefs()).toEqual(
        new Set([refFor('comp1'), refFor('comp2'), refFor('comp3')]),
      );

      // Cycle 2: comp3 goes missing from the source, but a low
      // rejectRemovalsAbovePercentage (removing 1 of 3 = 33%) causes the
      // removal to be rejected. comp3 stays in the catalog, but this
      // cycle's own mark bookkeeping still gets cleared by
      // `clearFinishedIngestions` on the `rest` -> next-cycle transition,
      // exactly as it would in production.
      await runCycle(['comp1', 'comp2'], 10);
      expect(await currentCatalogRefs()).toEqual(
        new Set([refFor('comp1'), refFor('comp2'), refFor('comp3')]),
      );

      // Cycle 3: comp3 is still missing from the source, and this time
      // there's no percentage guard. Before the fix, `computeRemoved`
      // determined staleness only by diffing against cycle 2's mark
      // bookkeeping — but that was already cleared, so `previousIngestion`
      // was never found and nothing was ever removed again, regardless of
      // how many further cycles ran. With the fix, comp3 is correctly
      // detected as stale by diffing against the catalog's actual state.
      await runCycle(['comp1', 'comp2']);
      const finalRefs = await currentCatalogRefs();
      expect(finalRefs).toEqual(new Set([refFor('comp1'), refFor('comp2')]));
      expect(finalRefs.has(refFor('comp3'))).toBe(false);
    });
  });
});
