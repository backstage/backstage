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
import { QueueManager } from './QueueManager';
import { MemoryQueue } from './adapters/MemoryQueue';
import { RedisQueue } from './adapters/RedisQueue';
import { SqsQueue } from './adapters/SqsQueue';
import { KafkaQueue } from './adapters/KafkaQueue';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Kafka } from 'kafkajs';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('pg-boss', () => {
  return class PgBoss {
    async start() {}
    async stop() {}
    async send() {}
    async work() {}
    async getQueueSize() {
      return 0;
    }
    async pause() {}
    async resume() {}
  };
});

jest.mock('ioredis', () => {
  return class Redis {
    on() {}
    duplicate() {
      return this;
    }
  };
});

jest.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123/test-plugin-test',
      }),
    })),
    GetQueueUrlCommand: jest.fn(),
  };
});

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn(),
      consumer: jest.fn(),
      admin: jest.fn(),
    })),
  };
});

const mockLogger = mockServices.logger.mock();
const mockLifecycle = mockServices.rootLifecycle.mock();

describe('QueueManager', () => {
  it('should create memory queue by default', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager.forPlugin('test-plugin').getQueue('test');

    expect(queue).toBeInstanceOf(MemoryQueue);
    // @ts-ignore
    expect(queue.queueName).toBe('test-plugin-test');
  });

  it('should create redis queue when configured as default store', async () => {
    const config = new ConfigReader({
      backend: {
        queue: {
          defaultStore: 'redis',
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
    const queue = await manager.forPlugin('test-plugin').getQueue('test');

    expect(queue).toBeInstanceOf(RedisQueue);
    // @ts-ignore
    expect(queue.queueName).toBe('test-plugin-test');
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
      .forPlugin('test-plugin')
      .getQueue('test', { store: 'redis' });

    expect(queue).toBeInstanceOf(RedisQueue);
    // @ts-ignore
    expect(queue.queueName).toBe('test-plugin-test');
  });

  it('should create sqs queue when requested via options', async () => {
    const config = new ConfigReader({
      backend: {
        queue: {
          sqs: {
            region: 'us-east-1',
          },
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin')
      .getQueue('test', { store: 'sqs' });

    expect(queue).toBeInstanceOf(SqsQueue);
    expect(SQSClient).toHaveBeenCalledWith(
      expect.objectContaining({ region: 'us-east-1' }),
    );
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
      .forPlugin('test-plugin')
      .getQueue('test', { store: 'kafka' });

    expect(queue).toBeInstanceOf(KafkaQueue);
    expect(Kafka).toHaveBeenCalledWith(
      expect.objectContaining({ brokers: ['kafka:9092'] }),
    );
  });

  it('should create postgres queue when requested via options', async () => {
    const config = new ConfigReader({
      backend: {
        queue: {
          postgres: {
            connection: 'postgresql://localhost:5432/backstage_queue',
            schema: 'test_pgboss',
          },
        },
      },
    });
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue = await manager
      .forPlugin('test-plugin')
      .getQueue('test', { store: 'postgres' });

    expect(queue).toBeDefined();
    // @ts-ignore
    expect(queue.queueName).toBe('test-plugin-test');
  });

  it('should reuse queue instances', async () => {
    const config = new ConfigReader({});
    const manager = QueueManager.fromConfig(config, {
      logger: mockLogger,
      lifecycle: mockLifecycle,
    });
    const queue1 = await manager.forPlugin('test-plugin').getQueue('test');
    const queue2 = await manager.forPlugin('test-plugin').getQueue('test');

    expect(queue1).toBe(queue2);
  });
});
