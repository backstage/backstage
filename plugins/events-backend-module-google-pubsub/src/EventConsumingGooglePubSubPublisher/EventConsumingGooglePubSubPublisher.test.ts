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
import { EventParams } from '@backstage/plugin-events-node';
import { PubSub } from '@google-cloud/pubsub';
import waitFor from 'wait-for-expect';
import { EventConsumingGooglePubSubPublisher } from './EventConsumingGooglePubSubPublisher';

describe('EventConsumingGooglePubSubPublisher', () => {
  const logger = mockServices.logger.mock();
  const events = mockServices.events.mock();

  let onEvent: undefined | ((event: EventParams) => void);
  events.subscribe.mockImplementation(async options => {
    onEvent = options.onEvent;
  });

  const topic = {
    publishMessage: jest.fn(),
  };
  const pubSub = {
    close: jest.fn(),
    topic: jest.fn(() => topic),
  };
  const pubSubFactory = jest.fn(() => pubSub as unknown as PubSub);

  beforeEach(() => {
    onEvent = undefined;
    jest.clearAllMocks();
  });

  it('should go though the expected registration and flows', async () => {
    const publisher = new EventConsumingGooglePubSubPublisher({
      logger,
      events,
      tasks: [
        {
          id: 'my-id',
          sourceTopics: ['my-topic'],
          targetTopicPattern: 'projects/my-project/topics/my-topic',
          mapToTopic: () => ({ project: 'my-project', topic: 'my-topic' }),
          mapToAttributes: m => ({ ...m.metadata, more: 'yes' }),
        },
      ],
      pubSubFactory,
    });

    // Start up

    await publisher.start();

    expect(events.subscribe).toHaveBeenCalledWith({
      id: 'EventConsumingGooglePubSubPublisher.my-id',
      topics: ['my-topic'],
      onEvent: expect.any(Function),
    });

    // Publish successfully

    onEvent!({
      topic: 'my-topic',
      eventPayload: { foo: 'bar' },
      metadata: { extra: 'data', more: 'yes' },
    });

    await waitFor(() => {
      expect(pubSubFactory).toHaveBeenCalledWith('my-project');
      expect(pubSub.topic).toHaveBeenCalledWith('my-topic');
      expect(topic.publishMessage).toHaveBeenCalledWith({
        json: { foo: 'bar' },
        attributes: { extra: 'data', more: 'yes' },
      });
    });

    // Simulate a failed publish

    topic.publishMessage.mockRejectedValueOnce(new Error('Failed to publish'));

    await expect(
      onEvent!({
        topic: 'my-topic',
        eventPayload: { foo: 'bar' },
        metadata: { extra: 'data', more: 'yes' },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to publish"`);

    expect(logger.error).toHaveBeenCalledWith(
      'Error publishing Google Pub/Sub message',
      new Error('Failed to publish'),
    );

    // Shut down

    await publisher.stop();
    expect(pubSub.close).toHaveBeenCalled();
  });
});
