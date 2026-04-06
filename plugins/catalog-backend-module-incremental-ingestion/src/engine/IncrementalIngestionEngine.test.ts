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

import { vi, type MockedFunction } from 'vitest';

import { IncrementalIngestionEngine } from './IncrementalIngestionEngine';
import { IterationEngineOptions } from '../types';
import { performance } from 'node:perf_hooks';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';

vi.mock('node:perf_hooks', () => ({
  performance: {
    now: vi.fn(),
  },
}));

const mockPerformanceNow = performance.now as MockedFunction<
  typeof performance.now
>;

describe('IncrementalIngestionEngine - Burst Length', () => {
  const createMockProvider = () => ({
    getProviderName: vi.fn().mockReturnValue('test-provider'),
    next: vi.fn(),
    around: vi.fn(),
  });

  const createMockManager = () =>
    ({
      getLastMark: vi.fn().mockResolvedValue(null),
      createMark: vi.fn().mockResolvedValue(undefined),
      createMarkEntities: vi.fn().mockResolvedValue(undefined),
      computeRemoved: vi.fn().mockResolvedValue({ total: 0, removed: [] }),
    } as any);

  const createMockConnection = () =>
    ({
      applyMutation: vi.fn().mockResolvedValue(undefined),
      refresh: vi.fn().mockResolvedValue(undefined),
    } as any);

  const createMockLogger = () =>
    ({
      info: vi.fn(),
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      child: vi.fn().mockReturnThis(),
    } as any);

  afterEach(() => {
    vi.restoreAllMocks();
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
