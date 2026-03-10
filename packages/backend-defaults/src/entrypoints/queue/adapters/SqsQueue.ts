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
  Job,
  JobOptions,
  ProcessHandler,
  ProcessInput,
  ProcessOptions,
  QueueWorker,
} from '@backstage/backend-plugin-api/alpha';
import { JsonValue } from '@backstage/types';
import { v4 as uuid } from 'uuid';
import {
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  Message,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

const MAX_SQS_DELAY_SECONDS = 900;

type SqsJobWrapper = {
  id: string;
  payload: JsonValue;
  priority: number;
  attempt: number;
  availableAt?: number;
};

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
  private processLoopPromise?: Promise<void>;
  private concurrency: number = 1;

  constructor(options: SqsQueueOptions) {
    super(options);
    this.client = options.client;
    this.queueUrl = options.queueUrl;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const id = uuid();
    const availableAt = options?.delay ? Date.now() + options.delay : undefined;

    const wrapper: SqsJobWrapper = {
      id,
      payload,
      priority: options?.priority ?? 20,
      attempt: 0,
      availableAt,
    };

    await this.sendWrappedJob(wrapper, options?.delay ?? 0);
  }

  process<T extends JsonValue = JsonValue>(
    handler: ProcessHandler<T>,
    options?: ProcessOptions,
  ): QueueWorker<T>;

  process<T extends JsonValue = JsonValue>(
    options?: ProcessOptions,
  ): QueueWorker<T>;

  process<T extends JsonValue = JsonValue>(
    handlerOrOptions?: ProcessInput<T>,
    maybeOptions?: ProcessOptions,
  ): QueueWorker<T> {
    const processing = this.prepareProcessing(handlerOrOptions, maybeOptions);
    if (!processing.handler) {
      return processing.worker;
    }

    this.concurrency =
      processing.options?.concurrency ?? this.defaultConcurrency;
    this.startProcessLoop();
    return processing.worker;
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

    await this.waitForPromisesToSettle(
      this.processLoopPromise ? [this.processLoopPromise] : [],
      {
        timeoutMessage: 'Timed out waiting for receive loop to complete',
      },
    );

    await this.waitForActiveProcessingToComplete();
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
    const wrapper = JSON.parse(body) as SqsJobWrapper;
    const updatedWrapper: SqsJobWrapper = {
      ...wrapper,
      attempt: job.attempt,
    };

    const backoffDelay = Math.pow(2, job.attempt - 1) * 1000;

    await this.sendWrappedJob(updatedWrapper, backoffDelay);
  }

  private startProcessLoop() {
    if (this.processLoopActive) return;
    this.processLoopActive = true;

    this.processLoopPromise = (async () => {
      try {
        while (!this.isDisconnecting) {
          if (!this.handler) {
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
              await new Promise(r => setTimeout(r, 100));
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
      } finally {
        this.processLoopActive = false;
        this.processLoopPromise = undefined;
      }
    })();
  }

  private async processMessage(message: Message): Promise<void> {
    const body = message.Body;
    if (!body) return;

    const receiptHandle = message.ReceiptHandle;
    if (!receiptHandle) {
      this.logger.error(
        `[${this.queueName}] Received SQS message without a receipt handle`,
      );
      return;
    }

    let job: Job | undefined;
    this.activeProcessingCount++;
    try {
      const wrapper = JSON.parse(body) as SqsJobWrapper;

      if (await this.rescheduleDelayedMessageIfNeeded(wrapper, receiptHandle)) {
        return;
      }

      const attempt = (wrapper.attempt ?? 0) + 1;

      job = {
        id: wrapper.id,
        payload: wrapper.payload,
        attempt,
      };

      if (this.handler) {
        await this.handler(job);
        await this.deleteMessage(receiptHandle);
      }
    } catch (error) {
      if (job) {
        const retryResult = await this.handleFailedJob(job, error);

        await this.deleteMessage(receiptHandle);

        if (retryResult.shouldRetry) {
          await this.retryJob(job, body);
        }
      } else {
        this.logger.error(
          `[${this.queueName}] Failed to parse SQS message, deleting`,
          error,
        );
        await this.deleteMessage(receiptHandle);
      }
    } finally {
      this.activeProcessingCount--;
    }
  }

  private async sendWrappedJob(
    wrapper: SqsJobWrapper,
    delayMs: number,
  ): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(wrapper),
      DelaySeconds: getDelaySeconds(delayMs),
    });

    await this.client.send(command);
  }

  private async rescheduleDelayedMessageIfNeeded(
    wrapper: SqsJobWrapper,
    receiptHandle: string,
  ): Promise<boolean> {
    if (!wrapper.availableAt) {
      return false;
    }

    const remainingDelayMs = wrapper.availableAt - Date.now();
    if (remainingDelayMs <= 0) {
      return false;
    }

    await this.sendWrappedJob(wrapper, remainingDelayMs);
    await this.deleteMessage(receiptHandle);
    return true;
  }
}

function getDelaySeconds(delayMs: number): number | undefined {
  if (delayMs <= 0) {
    return undefined;
  }

  return Math.min(Math.ceil(delayMs / 1000), MAX_SQS_DELAY_SECONDS);
}
