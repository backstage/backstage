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

import {
  LoggerService,
  Queue,
  QueueOptions,
  QueueService,
  RootConfigService,
  RootLifecycleService,
} from '@backstage/backend-plugin-api';
import { MemoryQueue } from './adapters/MemoryQueue';
import { RedisQueue } from './adapters/RedisQueue';
import { SqsQueue } from './adapters/SqsQueue';
import { KafkaQueue } from './adapters/KafkaQueue';
import { PostgresQueue } from './adapters/PostgresQueue';
import Redis from 'ioredis';
import {
  GetQueueUrlCommand,
  SQSClient,
  type SQSClientConfig,
} from '@aws-sdk/client-sqs';
import { Kafka } from 'kafkajs';
import PgBoss from 'pg-boss';
import { DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';

/**
 * Options for {@link QueueManager}.
 *
 * @public
 */
export type QueueManagerOptions = {
  logger: LoggerService;
  lifecycle: RootLifecycleService;
};

/**
 * Manages the creation of queues.
 *
 * @public
 */
export class QueueManager {
  private readonly defaultStore: string;
  private readonly config: RootConfigService;
  private readonly options: QueueManagerOptions;

  private redisClient?: Redis;
  private sqsClient?: SQSClient;
  private kafkaClient?: Kafka;
  private pgBossClient?: PgBoss;

  private readonly queues = new Map<string, Queue>();

  static fromConfig(
    config: RootConfigService,
    options: QueueManagerOptions,
  ): QueueManager {
    const store =
      config.getOptionalString('backend.queue.defaultStore') || 'memory';
    return new QueueManager(store, config, options);
  }

  constructor(
    store: string,
    config: RootConfigService,
    options: QueueManagerOptions,
  ) {
    this.defaultStore = store;
    this.config = config;
    this.options = options;

    // Make sure we shut down queues gracefully when the app shuts down
    options.lifecycle.addShutdownHook(async () => {
      this.options.logger.info(`[Queue] Disconnecting queues...`);
      await Promise.all(this.queues.values().map(queue => queue.disconnect()));
      this.queues.clear();
    });
  }

  forPlugin(pluginId: string): QueueService {
    return {
      getQueue: async (name: string, options: QueueOptions): Promise<Queue> => {
        return this.getQueue(pluginId, name, options);
      },
    };
  }

  private async getQueue(
    pluginId: string,
    name: string,
    options: QueueOptions,
  ): Promise<Queue> {
    const store = options?.store ?? this.defaultStore;
    const queueName = `${pluginId}-${name}`;

    if (this.queues.has(queueName)) {
      return this.queues.get(queueName)!;
    }

    const queueLogger = this.options.logger.child({
      type: 'queue',
      plugin: pluginId,
      queue: name,
    });

    let queue: Queue;

    if (store === 'memory') {
      queue = new MemoryQueue({
        logger: queueLogger,
        queueName: queueName,
        dlqHandler: options?.dlqHandler,
        maxAttempts: this.config.getOptionalNumber('backend.queue.maxAttempts'),
        defaultConcurrency: this.config.getOptionalNumber(
          'backend.queue.defaultConcurrency',
        ),
      });
    } else if (store === 'redis') {
      queue = this.createRedisQueue(queueName, queueLogger, options);
    } else if (store === 'sqs') {
      queue = await this.createSqsQueue(queueName, queueLogger, options);
    } else if (store === 'kafka') {
      queue = this.createKafkaQueue(queueName, queueLogger, options);
    } else if (store === 'postgres') {
      queue = await this.createPostgresQueue(queueName, queueLogger, options);
    } else {
      throw new Error(`Queue store '${store}' not supported`);
    }

    this.queues.set(queueName, queue);
    return queue;
  }

  private createRedisQueue(
    name: string,
    logger: LoggerService,
    options?: QueueOptions,
  ): Queue {
    if (!this.redisClient) {
      const connection =
        this.config.getOptionalString('backend.queue.redis.connection') ||
        process.env.REDIS_URL;

      if (!connection) {
        throw new Error('Redis queue connection config not found');
      }

      this.redisClient = new Redis(connection);

      this.redisClient.on('error', err => {
        this.options.logger.error('Redis client error', err);
      });

      this.options.logger.info(`[Queue] Connected to Redis queue backend`);
    }

    return new RedisQueue({
      client: this.redisClient,
      queueName: name,
      logger,
      dlqHandler: options?.dlqHandler,
      maxAttempts: this.config.getOptionalNumber('backend.queue.maxAttempts'),
      defaultConcurrency: this.config.getOptionalNumber(
        'backend.queue.defaultConcurrency',
      ),
    });
  }

  private async createSqsQueue(
    name: string,
    logger: LoggerService,
    options?: QueueOptions,
  ): Promise<Queue> {
    if (!this.sqsClient) {
      const region = this.config.getOptionalString('backend.queue.sqs.region');
      const endpoint = this.config.getOptionalString(
        'backend.queue.sqs.endpoint',
      );
      const credentials = this.config.getOptionalConfig(
        'backend.queue.sqs.credentials',
      );
      const accountId = this.config.getOptionalString(
        'backend.queue.sqs.accountId',
      );

      const clientConfig: SQSClientConfig = {};
      if (region) {
        clientConfig.region = region;
      }
      if (endpoint) {
        clientConfig.endpoint = endpoint;
      }
      if (credentials) {
        clientConfig.credentials = {
          accessKeyId: credentials.getString('accessKeyId'),
          secretAccessKey: credentials.getString('secretAccessKey'),
          accountId,
        };
      } else {
        const credsManager = DefaultAwsCredentialsManager.fromConfig(
          this.config,
        );
        clientConfig.credentials = (
          await credsManager.getCredentialProvider({ accountId })
        ).sdkCredentialProvider;
      }

      this.sqsClient = new SQSClient(clientConfig);

      this.options.logger.info(
        `[Queue] Connected to SQS queue backend (region: ${region}, endpoint: ${endpoint})`,
      );
    }

    const command = new GetQueueUrlCommand({ QueueName: name });
    const response = await this.sqsClient.send(command);
    if (!response.QueueUrl) {
      throw new Error(`Queue URL not found for queue '${name}'`);
    }

    return new SqsQueue({
      client: this.sqsClient,
      queueUrl: response.QueueUrl,
      queueName: name,
      logger,
      dlqHandler: options?.dlqHandler,
      maxAttempts: this.config.getOptionalNumber('backend.queue.maxAttempts'),
      defaultConcurrency: this.config.getOptionalNumber(
        'backend.queue.defaultConcurrency',
      ),
    });
  }

  private createKafkaQueue(
    name: string,
    logger: LoggerService,
    options?: QueueOptions,
  ): Queue {
    if (!this.kafkaClient) {
      const brokers = this.config.getStringArray('backend.queue.kafka.brokers');

      const clientId =
        this.config.getOptionalString('backend.queue.kafka.clientId') ||
        'backstage-backend';
      this.kafkaClient = new Kafka({
        clientId,
        brokers,
      });

      this.options.logger.info(
        `[Queue] Connected to Kafka queue backend (clientId: ${clientId})`,
      );
    }

    return new KafkaQueue({
      kafka: this.kafkaClient,
      queueName: name,
      logger,
      dlqHandler: options?.dlqHandler,
      maxAttempts: this.config.getOptionalNumber('backend.queue.maxAttempts'),
      defaultConcurrency: this.config.getOptionalNumber(
        'backend.queue.defaultConcurrency',
      ),
    });
  }

  private async createPostgresQueue(
    name: string,
    logger: LoggerService,
    options?: QueueOptions,
  ): Promise<Queue> {
    if (!this.pgBossClient) {
      const connectionString = this.config.getOptionalString(
        'backend.queue.postgres.connection',
      );

      if (!connectionString) {
        throw new Error('PostgreSQL queue connection string not found');
      }

      const schema =
        this.config.getOptionalString('backend.queue.postgres.schema') ||
        'backstage__queue_service';

      this.pgBossClient = new PgBoss({
        connectionString,
        schema,
        migrate: true,
        retryBackoff: true,
      });

      await this.pgBossClient.start();

      this.options.logger.info(
        `[Queue] Connected to PostgreSQL queue backend (schema: ${schema})`,
      );
    }

    return new PostgresQueue({
      boss: this.pgBossClient,
      queueName: name,
      logger,
      dlqHandler: options?.dlqHandler,
      maxAttempts: this.config.getOptionalNumber('backend.queue.maxAttempts'),
      defaultConcurrency: this.config.getOptionalNumber(
        'backend.queue.defaultConcurrency',
      ),
      stopBossOnDisconnect: false,
    });
  }
}
