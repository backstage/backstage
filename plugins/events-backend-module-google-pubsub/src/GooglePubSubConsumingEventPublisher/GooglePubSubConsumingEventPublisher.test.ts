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

import { mockServices } from '@backstage/backend-test-utils';
import { Message, PubSub } from '@google-cloud/pubsub';
import { GooglePubSubConsumingEventPublisher } from './GooglePubSubConsumingEventPublisher';
import { JsonObject } from '@backstage/types';
import waitFor from 'wait-for-expect';

function makeMessage(
  data: JsonObject,
  attributes: Record<string, string>,
): Message {
  const message: Partial<Message> = {
    attributes,
    data: Buffer.from(JSON.stringify(data), 'utf-8'),
    ack: jest.fn(),
    nack: jest.fn(),
  };
  return message as Message;
}

describe('GooglePubSubConsumingEventPublisher', () => {
  const logger = mockServices.logger.mock();
  const events = mockServices.events.mock();

  let onMessage: undefined | ((message: Message) => void);
  const subscription = {
    close: jest.fn(),
    on: jest.fn((event, fn) => {
      if (event === 'message') {
        onMessage = fn;
      }
    }),
  };

  const pubSub = {
    close: jest.fn(),
    subscription: jest.fn(() => subscription),
  };
  const pubSubFactory = jest.fn(() => pubSub as unknown as PubSub);

  beforeEach(() => {
    onMessage = undefined;
    jest.clearAllMocks();
  });

  it('should go though the expected registration and flows', async () => {
    const publisher = new GooglePubSubConsumingEventPublisher({
      logger,
      events,
      tasks: [
        {
          id: 'my-id',
          project: 'my-project',
          subscription: 'my-subscription',
          mapToTopic: () => 'my-topic',
          mapToMetadata: m => ({ ...m.attributes, more: 'yes' }),
        },
      ],
      pubSubFactory,
    });

    // Start up

    await publisher.start();

    expect(pubSubFactory).toHaveBeenCalledWith('my-project');
    expect(pubSub.subscription).toHaveBeenCalledWith(
      'my-subscription',
      expect.anything(),
    );

    // Publish successfully

    let message = makeMessage({ foo: 'bar' }, { extra: 'data' });
    onMessage!(message);

    await waitFor(() => {
      expect(events.publish).toHaveBeenCalledWith({
        topic: 'my-topic',
        eventPayload: { foo: 'bar' },
        metadata: { extra: 'data', more: 'yes' },
      });
      expect(message.ack).toHaveBeenCalled();
    });

    // Simulate a failed publish

    events.publish.mockRejectedValueOnce(new Error('Failed to publish'));

    message = makeMessage({ foo: 'bar' }, { extra: 'data' });
    onMessage!(message);

    await waitFor(() => {
      expect(message.nack).toHaveBeenCalled();
      expect(message.ack).not.toHaveBeenCalled();
    });

    // Shut down

    await publisher.stop();

    expect(subscription.close).toHaveBeenCalled();
    expect(pubSub.close).toHaveBeenCalled();
  });
});
