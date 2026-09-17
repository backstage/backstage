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
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { SchedulerService } from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import { AwsSqsConsumingEventPublisher } from './AwsSqsConsumingEventPublisher';
import { mockServices } from '@backstage/backend-test-utils';

const sqsSendMock = jest.fn();

describe('AwsSqsConsumingEventPublisher', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    sqsSendMock.mockReset();
  });

  it('creates one publisher instance per configured topic', async () => {
    const config = new ConfigReader({
      events: {
        modules: {
          awsSqs: {
            awsSqsConsumingEventPublisher: {
              topics: {
                fake1: {
                  queue: {
                    region: 'eu-west-1',
                    url: 'https://fake1.queue.url',
                  },
                },
                fake2: {
                  queue: {
                    region: 'us-east-1',
                    url: 'https://fake2.queue.url',
                  },
                },
              },
            },
          },
        },
      },
    });
    const logger = mockServices.logger.mock();
    const events = new TestEventsService();
    const scheduler = {
      scheduleTask: jest.fn(),
    } as unknown as SchedulerService;

    const publishers = AwsSqsConsumingEventPublisher.fromConfig({
      config,
      events,
      logger,
      scheduler,
    });
    expect(publishers.length).toEqual(2);
  });

  it('polling will be scheduled after connecting to the EventBroker', async () => {
    const config = new ConfigReader({
      events: {
        modules: {
          awsSqs: {
            awsSqsConsumingEventPublisher: {
              topics: {
                fake1: {
                  queue: {
                    region: 'eu-west-1',
                    url: 'https://fake1.queue.url',
                  },
                },
              },
            },
          },
        },
      },
    });
    const logger = mockServices.logger.mock();
    const events = new TestEventsService();
    const scheduler = {
      scheduleTask: jest.fn(),
    } as unknown as SchedulerService;

    const publishers = AwsSqsConsumingEventPublisher.fromConfig({
      config,
      events,
      logger,
      scheduler,
    });
    expect(publishers.length).toEqual(1);

    const publisher = publishers[0];
    await publisher.start();

    // publisher.connect(..) was causing the polling for events to be scheduled
    expect(scheduler.scheduleTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'events.awsSqs.publisher:fake1',
        frequency: { seconds: 0 },
        timeout: { seconds: 260 },
        scope: 'local',
      }),
    );
  });

  it('publishes events for received messages and deletes them in bulk', async () => {
    const config = new ConfigReader({
      events: {
        modules: {
          awsSqs: {
            awsSqsConsumingEventPublisher: {
              topics: {
                fake1: {
                  queue: {
                    region: 'eu-west-1',
                    url: 'https://fake1.queue.url',
                  },
                  waitTimeAfterEmptyReceive: { seconds: 1 },
                },
              },
            },
          },
        },
      },
    });
    const logger = mockServices.logger.mock();
    const events = new TestEventsService();
    let taskFn: (() => Promise<void>) | undefined = undefined;
    const scheduler = {
      scheduleTask: (spec: { fn: () => Promise<void> }) => {
        taskFn = spec.fn;
      },
    } as unknown as SchedulerService;

    // on the first attempt, we will return 0 messages; on the second attempt, 2 messages; afterwards 0 messages
    let receiveCalls = 0;
    jest.spyOn(SQSClient.prototype, 'send').mockImplementation(sqsSendMock);
    sqsSendMock.mockImplementation(async command => {
      if (command instanceof ReceiveMessageCommand) {
        receiveCalls += 1;
        if (receiveCalls === 1) {
          return { Messages: [] };
        }
        if (receiveCalls === 2) {
          return {
            Messages: [
              {
                Body: '{"event":"payload1"}',
                ReceiptHandle: 'fake-handle1',
                MessageAttributes: {
                  'X-Custom-Attr': {
                    DataType: 'String',
                    StringValue: 'value',
                  },
                },
              },
              {
                Body: '{"event":"payload2"}',
                ReceiptHandle: 'fake-handle2',
              },
            ],
          };
        }
        return { Messages: [] };
      }
      if (command instanceof DeleteMessageBatchCommand) {
        return {
          Failed: [
            {
              Id: 'message-1',
              Message: 'test failure',
              SenderFault: true,
              Code: '400',
            },
          ],
          Successful: [{ Id: 'message-0' }],
        };
      }
      throw new Error(`No mock for ${command.constructor.name}`);
    });

    const publishers = AwsSqsConsumingEventPublisher.fromConfig({
      config,
      events,
      logger,
      scheduler,
    });
    expect(publishers.length).toEqual(1);
    const publisher = publishers[0];
    await publisher.start();

    await taskFn!();
    await taskFn!();
    await taskFn!();

    const receiveMessageCommands = sqsSendMock.mock.calls
      .map(call => call[0])
      .filter(
        (command): command is ReceiveMessageCommand =>
          command instanceof ReceiveMessageCommand,
      );
    expect(receiveMessageCommands).toHaveLength(3);
    for (const command of receiveMessageCommands) {
      expect(command.input).toEqual(
        expect.objectContaining({
          MaxNumberOfMessages: 10,
          QueueUrl: 'https://fake1.queue.url',
          WaitTimeSeconds: 20,
        }),
      );
    }

    const deleteMessageCommands = sqsSendMock.mock.calls
      .map(call => call[0])
      .filter(
        (command): command is DeleteMessageBatchCommand =>
          command instanceof DeleteMessageBatchCommand,
      );
    expect(deleteMessageCommands).toHaveLength(1);
    expect(deleteMessageCommands[0].input).toEqual({
      QueueUrl: 'https://fake1.queue.url',
      Entries: [
        {
          Id: 'message-0',
          ReceiptHandle: 'fake-handle1',
        },
        {
          Id: 'message-1',
          ReceiptHandle: 'fake-handle2',
        },
      ],
    });

    expect(events.published).toHaveLength(2);
    expect(events.published[0].topic).toEqual('fake1');
    expect(events.published[0].eventPayload).toEqual({
      event: 'payload1',
    });
    expect(events.published[0].metadata).toEqual({
      'X-Custom-Attr': 'value',
    });

    expect(events.published[1].topic).toEqual('fake1');
    expect(events.published[1].eventPayload).toEqual({
      event: 'payload2',
    });
    expect(events.published[1].metadata).toEqual({});
  });
});
