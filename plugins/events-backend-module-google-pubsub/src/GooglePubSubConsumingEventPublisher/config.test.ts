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
import { JsonObject } from '@backstage/types';
import { Message } from '@google-cloud/pubsub';
import { readSubscriptionTasksFromConfig } from './config';

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

describe('readSubscriptionTasksFromConfig', () => {
  it('reads with basic targetTopic', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            googlePubSubConsumingEventPublisher: {
              subscriptions: {
                subKey: {
                  subscriptionName: 'projects/pid/subscriptions/sid',
                  targetTopic: 'my-topic',
                },
              },
            },
          },
        },
      },
    };

    const result = readSubscriptionTasksFromConfig(
      mockServices.rootConfig({ data }),
    );

    expect(result).toEqual([
      {
        id: 'subKey',
        project: 'pid',
        subscription: 'sid',
        mapToTopic: expect.any(Function),
        mapToMetadata: expect.any(Function),
      },
    ]);

    expect(
      result[0].mapToTopic(makeMessage({ foo: 'bar' }, { attr: 'yes' })),
    ).toBe('my-topic');
    expect(
      result[0].mapToMetadata(makeMessage({ foo: 'bar' }, { attr: 'yes' })),
    ).toEqual({ attr: 'yes' });
  });

  it('fills in placeholders', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            googlePubSubConsumingEventPublisher: {
              subscriptions: {
                sub1: {
                  subscriptionName: 'projects/pid/subscriptions/sid',
                  targetTopic: 't.{{ message.attributes.exists }}',
                  eventMetadata: {
                    meta1: 'updated.{{ message.attributes.exists }}',
                    meta2: 'updated.{{ message.attributes.missing }}',
                  },
                },
                sub2: {
                  subscriptionName: 'projects/pid/subscriptions/sid',
                  targetTopic: 't.{{ message.attributes.missing }}',
                  eventMetadata: {
                    meta3: 'new',
                  },
                },
              },
            },
          },
        },
      },
    };

    const result = readSubscriptionTasksFromConfig(
      mockServices.rootConfig({ data }),
    );

    expect(result).toEqual([
      {
        id: 'sub1',
        project: 'pid',
        subscription: 'sid',
        mapToTopic: expect.any(Function),
        mapToMetadata: expect.any(Function),
      },
      {
        id: 'sub2',
        project: 'pid',
        subscription: 'sid',
        mapToTopic: expect.any(Function),
        mapToMetadata: expect.any(Function),
      },
    ]);

    expect(
      result[0].mapToTopic(
        makeMessage(
          { foo: 'bar' },
          { exists: 'exists', meta1: 'original1', meta2: 'original2' },
        ),
      ),
    ).toBe('t.exists'); // Message attribute existed, successfully routed
    expect(
      result[0].mapToMetadata(
        makeMessage(
          { foo: 'bar' },
          { exists: 'exists', meta1: 'original1', meta2: 'original2' },
        ),
      ),
    ).toEqual({
      exists: 'exists',
      meta1: 'updated.exists', // message attribute existed, was replaced
      meta2: 'original2', // message attribute did not exist, was not replaced
    });

    expect(
      result[1].mapToTopic(
        makeMessage(
          { foo: 'bar' },
          { exists: 'exists', meta1: 'original1', meta2: 'original2' },
        ),
      ),
    ).toBeUndefined(); // Message attribute did not exist, could not be routed
    expect(
      result[1].mapToMetadata(
        makeMessage(
          { foo: 'bar' },
          { exists: 'exists', meta1: 'original1', meta2: 'original2' },
        ),
      ),
    ).toEqual({
      exists: 'exists',
      meta1: 'original1',
      meta2: 'original2',
      meta3: 'new',
    });
  });

  it('rejects malformed subscription name', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            googlePubSubConsumingEventPublisher: {
              subscriptions: {
                subKey: {
                  subscriptionName: 'sid',
                  targetTopic: 'foo',
                },
              },
            },
          },
        },
      },
    };

    expect(() =>
      readSubscriptionTasksFromConfig(mockServices.rootConfig({ data })),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Expected Googoe Pub/Sub 'subscriptionName' to be on the form 'projects/PROJECT_ID/subscriptions/SUBSCRIPTION_ID' but got 'sid'"`,
    );
  });
});
