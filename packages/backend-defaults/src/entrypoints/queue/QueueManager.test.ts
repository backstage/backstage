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

import { ConfigReader } from '@backstage/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { mockServices } from '@backstage/backend-test-utils';
import { QueueManager } from './QueueManager';
import { DatabaseQueue } from './adapters/DatabaseQueue';
import { KafkaQueue } from './adapters/KafkaQueue';
import { MemoryQueue } from './adapters/MemoryQueue';
import { RedisQueue } from './adapters/RedisQueue';
import { SqsQueue } from './adapters/SqsQueue';

jest.mock('ioredis', () => {
  return class Redis {
    on() {}
    duplicate() {
      return this;
    }
  };
});

const mockLogger = mockServices.logger.mock();
const mockLifecycle = mockServices.rootLifecycle.mock();
const mockKnex = {
  client: {},
  migrate: {
    latest: jest.fn().mockResolvedValue(undefined),
  },
} as any;
const mockDatabase = mockServices.database.mock({
  getClient: jest.fn().mockResolvedValue(mockKnex),
});

beforeEach(() => {
  mockKnex.migrate.latest.mockClear();
});

describe('QueueManager', () => {
  it('should create database queue by default', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test');

    expect(queue).toBeInstanceOf(DatabaseQueue);
    expect((queue as any).queueName).toBe('test-plugin-test');
  });

  it('should create memory queue when configured as default store', async () => {
    const config = new ConfigReader({
      backend: {
        queue: {
          defaultStore: 'memory',
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test');

    expect(queue).toBeInstanceOf(MemoryQueue);
    expect((queue as any).queueName).toBe('test-plugin-test');
  });

  it('should create redis queue when requested via options', async () => {
    const config = new ConfigReader({
      backend: {
        queue: {
          redis: {
            connection: 'redis://localhost:6379',
          },
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test', { store: 'redis' });

    expect(queue).toBeInstanceOf(RedisQueue);
    expect((queue as any).queueName).toBe('test-plugin-test');
  });

  it('should require redis connection config when using redis queues', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });

    await expect(
      manager
        .forPlugin('test-plugin', {
          database: mockDatabase,
          logger: mockLogger,
        })
        .getQueue('test', { store: 'redis' }),
    ).rejects.toThrow('Redis queue connection config not found');
  });

  it('should create sqs queue when requested via options', async () => {
    const sendSpy = jest
      .spyOn(SQSClient.prototype as any, 'send')
      .mockResolvedValue({
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123/test-plugin-test',
      } as any);

    const config = new ConfigReader({
      backend: {
        queue: {
          sqs: {
            region: 'us-east-1',
            endpoint: 'http://localhost:4566',
            credentials: {
              accessKeyId: 'test',
              secretAccessKey: 'test',
            },
          },
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test', { store: 'sqs' });

    try {
      expect(queue).toBeInstanceOf(SqsQueue);
      expect(sendSpy).toHaveBeenCalled();
    } finally {
      sendSpy.mockRestore();
    }
  });

  it('should create kafka queue when requested via options', async () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          queue: {
            kafka: {
              brokers: ['kafka:9092'],
            },
          },
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test', { store: 'kafka' });

    expect(queue).toBeInstanceOf(KafkaQueue);
    expect((queue as any).queueName).toBe('test-plugin-test');
  });

  it('should create database queue when requested via options', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin', {
        database: mockDatabase,
        logger: mockLogger,
      })
      .getQueue('test', { store: 'database' });

    expect(queue).toBeInstanceOf(DatabaseQueue);
    expect((queue as any).queueName).toBe('test-plugin-test');
  });

  it('should reuse queue instances', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queueService = manager.forPlugin('test-plugin', {
      database: mockDatabase,
      logger: mockLogger,
    });
    const queue1 = await queueService.getQueue('test');
    const queue2 = await queueService.getQueue('test');

    expect(queue1).toBe(queue2);
  });

  it('should disconnect all queues during shutdown', async () => {
    const lifecycle = mockServices.rootLifecycle.mock();
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle,
    });
    const queueService = manager.forPlugin('test-plugin', {
      database: mockDatabase,
      logger: mockLogger,
    });

    const queue1 = await queueService.getQueue('first');
    const queue2 = await queueService.getQueue('second');
    const disconnect1 = jest.spyOn(queue1, 'disconnect').mockResolvedValue();
    const disconnect2 = jest.spyOn(queue2, 'disconnect').mockResolvedValue();

    const shutdownHook = (lifecycle.addShutdownHook as jest.Mock).mock
      .calls[0][0];
    await shutdownHook();

    expect(disconnect1).toHaveBeenCalledTimes(1);
    expect(disconnect2).toHaveBeenCalledTimes(1);
  });
});
