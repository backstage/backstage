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

import { Job, JobOptions, ProcessOptions } from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';
import { v4 as uuid } from 'uuid';
import { Admin, Consumer, Kafka, Producer } from 'kafkajs';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

export type KafkaQueueOptions = BaseQueueOptions & {
  kafka: Kafka;
  topic?: string;
  groupId?: string;
};

/**
 * Queue implementation for Apache Kafka.
 *
 * @internal
 */
export class KafkaQueue extends BaseQueue {
  private readonly kafka: Kafka;
  private readonly topic: string;
  private readonly groupId: string;

  private producer?: Producer;
  private consumer?: Consumer;
  private admin?: Admin;

  constructor(options: KafkaQueueOptions) {
    super(options);
    this.kafka = options.kafka;
    this.topic = options.topic ?? this.queueName;
    this.groupId = options.groupId || `backstage-queue-${this.topic}`;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const id = uuid();
    const wrapper = {
      id,
      payload,
      attempt: 0,
      priority: options?.priority ?? 20,
    };

    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }

    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          value: JSON.stringify(wrapper),
        },
      ],
    });
  }

  process(
    handler: (job: Job) => Promise<void>,
    options?: ProcessOptions,
  ): void {
    super.process(handler, options);
    this.startConsumer();
  }

  async getJobCount(): Promise<number> {
    if (!this.admin) {
      this.admin = this.kafka.admin();
      await this.admin.connect();
    }

    try {
      const offsets = await this.admin.fetchTopicOffsets(this.topic);
      const groupOffsetsResponse = await this.admin.fetchOffsets({
        groupId: this.groupId,
        topics: [this.topic],
      });

      const groupTopic = groupOffsetsResponse.find(t => t.topic === this.topic);
      const groupPartitions = groupTopic?.partitions ?? [];

      let totalLag = 0;

      for (const partOffset of offsets) {
        const consumed = groupPartitions.find(
          g => g.partition === partOffset.partition,
        );
        if (consumed) {
          const lag =
            Number.parseInt(partOffset.offset, 10) -
            Number.parseInt(consumed.offset, 10);
          if (lag > 0) totalLag += lag;
        } else {
          totalLag += Number.parseInt(partOffset.offset, 10);
        }
      }
      return totalLag;
    } catch (error) {
      this.logger.error(
        `[${this.queueName}] Failed to get Kafka job count`,
        error,
      );
      return 0;
    }
  }

  async pause(): Promise<void> {
    if (this.consumer) {
      this.consumer.pause([{ topic: this.topic }]);
    }
    await super.pause();
  }

  async resume(): Promise<void> {
    if (this.consumer) {
      this.consumer.resume([{ topic: this.topic }]);
    }
    await super.resume();
  }

  protected async onDisconnect(): Promise<void> {
    if (this.producer) await this.producer.disconnect();
    if (this.consumer) await this.consumer.disconnect();
    if (this.admin) await this.admin.disconnect();
  }

  private parseJobFromMessage(body: string): Job {
    const wrapper = JSON.parse(body);
    return {
      id: wrapper.id,
      payload: wrapper.payload,
      attempt: (wrapper.attempt ?? 0) + 1,
    };
  }

  private async retryJob(job: Job, body: string): Promise<void> {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }

    const wrapper = JSON.parse(body);
    const updatedWrapper = {
      ...wrapper,
      attempt: job.attempt,
    };

    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          value: JSON.stringify(updatedWrapper),
        },
      ],
    });

    this.logger.debug(
      `[${this.queueName}] Retrying job ${job.id}, attempt ${job.attempt}/${this.maxAttempts}`,
    );
  }

  private async startConsumer() {
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (this.isDisconnecting || !message.value) {
          return;
        }

        const body = message.value.toString();
        let job: Job | undefined;

        try {
          job = this.parseJobFromMessage(body);

          if (this.handler) {
            await this.handler(job);
          }
        } catch (error) {
          try {
            job ??= this.parseJobFromMessage(body);
            const retryResult = await this.handleFailedJob(job, error);

            if (retryResult.shouldRetry) {
              await this.retryJob(job, body);
            }
          } catch (dlqError) {
            this.logger.error(
              `[${this.queueName}] Failed to handle failed Kafka message`,
              dlqError,
            );
          }
        }
      },
    });
  }
}
