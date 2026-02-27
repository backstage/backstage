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
import {
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

export type SqsQueueOptions = BaseQueueOptions & {
  client: SQSClient;
  queueUrl: string;
};

/**
 * Queue implementation for AWS SQS.
 *
 * @internal
 */
export class SqsQueue extends BaseQueue {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  private processLoopActive: boolean = false;
  private concurrency: number = 1;

  constructor(options: SqsQueueOptions) {
    super(options);
    this.client = options.client;
    this.queueUrl = options.queueUrl;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const id = uuid();

    const wrapper = {
      id,
      payload,
      priority: options?.priority ?? 20,
      attempt: 0,
    };

    const delay = options?.delay
      ? Math.min(Math.floor(options.delay / 1000), 900)
      : undefined;

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(wrapper),
      DelaySeconds: delay,
    });

    await this.client.send(command);
  }

  process(
    handler: (job: Job) => Promise<void>,
    options?: ProcessOptions,
  ): void {
    super.process(handler, options);
    this.concurrency = options?.concurrency ?? this.defaultConcurrency;
    this.startProcessLoop();
  }

  async getJobCount(): Promise<number> {
    const command = new GetQueueAttributesCommand({
      QueueUrl: this.queueUrl,
      AttributeNames: [
        'ApproximateNumberOfMessages',
        'ApproximateNumberOfMessagesNotVisible',
        'ApproximateNumberOfMessagesDelayed',
      ],
    });
    const result = await this.client.send(command);

    const visible = Number.parseInt(
      result.Attributes?.ApproximateNumberOfMessages ?? '0',
      10,
    );
    const notVisible = Number.parseInt(
      result.Attributes?.ApproximateNumberOfMessagesNotVisible ?? '0',
      10,
    );
    const delayed = Number.parseInt(
      result.Attributes?.ApproximateNumberOfMessagesDelayed ?? '0',
      10,
    );

    return visible + notVisible + delayed;
  }

  protected async onDisconnect(): Promise<void> {
    this.processLoopActive = false;
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    await this.client.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  }

  private async retryJob(job: Job, body: string): Promise<void> {
    const wrapper = JSON.parse(body);
    const updatedWrapper = {
      ...wrapper,
      attempt: job.attempt,
    };

    const backoffDelay = Math.min(Math.pow(2, job.attempt - 1), 900);

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(updatedWrapper),
      DelaySeconds: backoffDelay,
    });

    await this.client.send(command);
  }

  private startProcessLoop() {
    if (this.processLoopActive) return;
    this.processLoopActive = true;

    (async () => {
      try {
        while (!this.isDisconnecting) {
          if (this.isPaused || !this.handler) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }

          try {
            const maxMessages = Math.min(this.concurrency, 10);

            const command = new ReceiveMessageCommand({
              QueueUrl: this.queueUrl,
              MaxNumberOfMessages: maxMessages,
              WaitTimeSeconds: 20, // Long polling
            });

            const result = await this.client.send(command);

            if (!result.Messages || result.Messages.length === 0) {
              continue;
            }

            const processingPromises = result.Messages.map(message =>
              this.processMessage(message),
            );

            await Promise.all(processingPromises);
          } catch (error) {
            this.logger.error(`[${this.queueName}] SQS receive error`, error);
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      } catch (error) {
        this.logger.error(
          `[${this.queueName}] Fatal error in SQS process loop`,
          error,
        );
        this.processLoopActive = false;
      }
    })();
  }

  private async processMessage(message: any): Promise<void> {
    const body = message.Body;
    if (!body) return;

    let job: Job | undefined;
    try {
      const wrapper = JSON.parse(body);
      const attempt = (wrapper.attempt ?? 0) + 1;

      job = {
        id: wrapper.id,
        payload: wrapper.payload,
        attempt,
      };

      if (this.handler) {
        await this.handler(job);
        await this.deleteMessage(message.ReceiptHandle!);
      }
    } catch (error) {
      if (job) {
        const retryResult = await this.handleFailedJob(job, error);

        await this.deleteMessage(message.ReceiptHandle!);

        if (retryResult.shouldRetry) {
          await this.retryJob(job, body);
        }
      } else {
        this.logger.error(
          `[${this.queueName}] Failed to parse SQS message, deleting`,
          error,
        );
        await this.deleteMessage(message.ReceiptHandle!);
      }
    }
  }
}
