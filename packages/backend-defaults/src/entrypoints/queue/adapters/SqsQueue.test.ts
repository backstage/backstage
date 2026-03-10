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
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import waitForExpect from 'wait-for-expect';
import { mockServices } from '@backstage/backend-test-utils';
import { SqsQueue } from './SqsQueue';

const mockLogger = mockServices.logger.mock();

describe('SqsQueue', () => {
  it('caps long delays and stores the full availableAt timestamp', async () => {
    const client = {
      send: jest.fn().mockResolvedValue({}),
    } as unknown as SQSClient;
    const queue = new SqsQueue({
      client,
      logger: mockLogger,
      queueName: 'test',
      queueUrl: 'https://example.com/queue',
    });

    const startTime = Date.now();
    await queue.add({ id: 'job' }, { delay: 16 * 60 * 1000 + 5000 });

    const command = (client.send as jest.Mock).mock
      .calls[0][0] as SendMessageCommand;
    expect(command.input.DelaySeconds).toBe(900);

    const wrapper = JSON.parse(command.input.MessageBody!);
    expect(wrapper.availableAt).toBeGreaterThanOrEqual(
      startTime + 16 * 60 * 1000 + 5000,
    );
  });

  it('requeues delayed messages until the full delay has elapsed', async () => {
    const send = jest.fn().mockImplementation(command => {
      if (command instanceof ReceiveMessageCommand) {
        if (
          send.mock.calls.filter(
            call => call[0] instanceof ReceiveMessageCommand,
          ).length === 1
        ) {
          return Promise.resolve({
            Messages: [
              {
                Body: JSON.stringify({
                  id: 'job',
                  payload: { id: 'job' },
                  priority: 20,
                  attempt: 0,
                  availableAt: Date.now() + 16 * 60 * 1000,
                }),
                ReceiptHandle: 'receipt-handle',
              },
            ],
          });
        }

        return Promise.resolve({ Messages: [] });
      }

      return Promise.resolve({});
    });

    const client = { send } as unknown as SQSClient;
    const queue = new SqsQueue({
      client,
      logger: mockLogger,
      queueName: 'test',
      queueUrl: 'https://example.com/queue',
    });
    const handler = jest.fn();

    try {
      queue.process(handler);

      await waitForExpect(() => {
        const sendCommands = send.mock.calls
          .map(call => call[0])
          .filter(
            command => command instanceof SendMessageCommand,
          ) as SendMessageCommand[];
        const deleteCommands = send.mock.calls
          .map(call => call[0])
          .filter(
            command => command instanceof DeleteMessageCommand,
          ) as DeleteMessageCommand[];

        expect(sendCommands).toHaveLength(1);
        expect(sendCommands[0].input.DelaySeconds).toBe(900);
        expect(deleteCommands).toHaveLength(1);
        expect(handler).not.toHaveBeenCalled();
      });
    } finally {
      await queue.disconnect();
    }
  });
});
