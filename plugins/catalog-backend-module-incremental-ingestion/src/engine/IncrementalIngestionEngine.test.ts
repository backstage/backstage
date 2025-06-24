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
import { performance } from 'perf_hooks';

jest.setTimeout(60_000);

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
      computeRemoved: jest.fn().mockResolvedValue({ total: 0, removed: [] }),
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

  it('should respect burst length and stop burst when time limit exceeded', async () => {
    const mockProvider = createMockProvider();
    const mockManager = createMockManager();
    const mockConnection = createMockConnection();
    const mockLogger = createMockLogger();

    const options: IterationEngineOptions = {
      provider: mockProvider,
      manager: mockManager,
      connection: mockConnection,
      burstLength: { milliseconds: 100 }, // Short burst length for testing
      restLength: { minutes: 1 },
      logger: mockLogger,
      ready: Promise.resolve(),
    };

    const engine = new IncrementalIngestionEngine(options);

    let callCount = 0;
    mockProvider.around.mockImplementation(async fn => {
      await fn({});
    });

    // Mock provider.next to return multiple batches that never complete
    // Each call takes some time to simulate real processing
    mockProvider.next.mockImplementation(async () => {
      callCount++;
      // Add a small delay to ensure we exceed burst length
      await new Promise(resolve => setTimeout(resolve, 30));
      return {
        done: false, // Never done - would continue forever without burst length
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
    const start = performance.now();

    const result = await engine.ingestOneBurst('test-ingestion', signal);

    const duration = performance.now() - start;

    // Verify that the burst was stopped due to time limit, not completion
    expect(result).toBe(false); // Should return false since provider never returned done
    expect(duration).toBeGreaterThanOrEqual(100); // Should have run for at least the burst length
    expect(duration).toBeLessThan(200); // But not too much longer (allowing for timing variance)
    expect(mockProvider.next).toHaveBeenCalledTimes(callCount);
    expect(callCount).toBeGreaterThan(1); // Should have made multiple calls before stopping

    // Verify that burst was terminated due to time limit (not normal completion)
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('burst ending after'),
    );
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
      burstLength: { seconds: 10 }, // Long burst length
      restLength: { minutes: 1 },
      logger: mockLogger,
      ready: Promise.resolve(),
    };

    const engine = new IncrementalIngestionEngine(options);

    mockProvider.around.mockImplementation(async fn => {
      await fn({});
    });

    // Mock provider.next to return done after first call
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

    // Should return true when provider indicates done
    expect(result).toBe(true);
    expect(mockProvider.next).toHaveBeenCalledTimes(1);

    // Should NOT log the burst exceeded message
    expect(mockLogger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('burst ending after'),
    );

    // Should log burst initiation and completion
    expect(mockLogger.info).toHaveBeenCalledWith(
      "incremental-engine: Ingestion 'test-ingestion' burst initiated",
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "incremental-engine: Ingestion 'test-ingestion' burst complete",
      ),
    );
  });
});
