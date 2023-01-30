/*
 * Copyright 2022 The Backstage Authors
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
  DeleteMessageBatchCommand,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EventBroker, EventPublisher } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { AwsSqsEventSourceConfig, readConfig } from './config';

/**
 * Publishes events received from an AWS SQS queue.
 * The message payload will be used as event payload and passed to registered subscribers.
 *
 * @public
 */
// TODO(pjungermann): add prom metrics? (see plugins/catalog-backend/src/util/metrics.ts, etc.)
export class AwsSqsConsumingEventPublisher implements EventPublisher {
  private readonly topic: string;
  private readonly receiveParams: ReceiveMessageCommandInput;
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;
  private readonly taskTimeoutSeconds: number;
  private readonly waitTimeAfterEmptyReceiveMs;
  private eventBroker?: EventBroker;

  static fromConfig(env: {
    config: Config;
    logger: Logger;
    scheduler: PluginTaskScheduler;
  }): AwsSqsConsumingEventPublisher[] {
    return readConfig(env.config).map(
      config =>
        new AwsSqsConsumingEventPublisher(env.logger, env.scheduler, config),
    );
  }

  private constructor(
    private readonly logger: Logger,
    private readonly scheduler: PluginTaskScheduler,
    config: AwsSqsEventSourceConfig,
  ) {
    this.topic = config.topic;

    this.receiveParams = {
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: config.queueUrl,
      VisibilityTimeout: config.visibilityTimeout?.as('seconds'),
      WaitTimeSeconds: config.pollingWaitTime.as('seconds'),
    };
    this.sqs = new SQSClient({ region: config.region });
    this.queueUrl = config.queueUrl;

    this.taskTimeoutSeconds = config.timeout.as('seconds');
    this.waitTimeAfterEmptyReceiveMs =
      config.waitTimeAfterEmptyReceive.as('milliseconds');
  }

  async setEventBroker(eventBroker: EventBroker): Promise<void> {
    this.eventBroker = eventBroker;
    return this.start();
  }

  private async start(): Promise<void> {
    const id = `events.awsSqs.publisher:${this.topic}`;
    const logger = this.logger.child({
      class: AwsSqsConsumingEventPublisher.prototype.constructor.name,
      taskId: id,
    });

    await this.scheduler.scheduleTask({
      id: id,
      frequency: { seconds: 0 },
      timeout: { seconds: this.taskTimeoutSeconds },
      scope: 'local',
      fn: async () => {
        try {
          const numMessages = await this.consumeMessages();
          if (numMessages === 0) {
            await this.sleep(this.waitTimeAfterEmptyReceiveMs);
          }
        } catch (error) {
          logger.error('Failed to consume AWS SQS messages', error);
        }
      },
    });
  }

  private async deleteMessages(messages?: Message[]): Promise<void> {
    if (!messages) {
      return;
    }

    const deleteParams = {
      QueueUrl: this.queueUrl,
      Entries: messages.map((message, index) => {
        return {
          Id: message.MessageId ?? `message-${index}`,
          ReceiptHandle: message.ReceiptHandle,
        };
      }),
    };

    try {
      const result = await this.sqs.send(
        new DeleteMessageBatchCommand(deleteParams),
      );
      if (result.Failed) {
        this.logger.error(
          `Failed to delete ${result.Failed!.length} of ${
            messages.length
          } messages from AWS SQS ${this.queueUrl}. First: ${
            result.Failed[0].Message
          }`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete message from AWS SQS ${this.queueUrl}`,
        error,
      );
    }
  }

  private async consumeMessages(): Promise<number> {
    try {
      const data = await this.sqs.send(
        new ReceiveMessageCommand(this.receiveParams),
      );

      data.Messages?.forEach(message => {
        const eventPayload = JSON.parse(message.Body!);

        const metadata: Record<string, string | string[]> = {};
        Object.keys(message.MessageAttributes ?? {}).forEach(key => {
          const attrValue = message.MessageAttributes![key];
          if (
            !attrValue ||
            !attrValue.DataType ||
            !['String', 'Number'].includes(attrValue.DataType)
          ) {
            return;
          }

          const value = attrValue.StringListValues ?? attrValue.StringValue;
          if (value !== undefined) {
            metadata[key] = value;
          }
        });

        this.eventBroker!.publish({
          topic: this.topic,
          eventPayload,
          metadata,
        });
      });
      await this.deleteMessages(data.Messages);
      return data.Messages?.length ?? 0;
    } catch (error) {
      this.logger.error(
        `Failed to receive events from AWS SQS ${this.queueUrl}`,
        error,
      );
      return 0;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
}
