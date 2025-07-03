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
import { readSubscriptionTasksFromConfig } from './config';

describe('readSubscriptionTasksFromConfig', () => {
  it('reads with basic targetTopic', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            eventConsumingGooglePubSubPublisher: {
              subscriptions: {
                subKey1: {
                  sourceTopic: 'my-topic',
                  targetTopicName: 'projects/pid/topics/tid',
                },
                subKey2: {
                  sourceTopic: ['my-topic-1', 'my-topic-2'],
                  targetTopicName: 'projects/pid/topics/tid.{{ event.topic }}',
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
        id: 'subKey1',
        sourceTopics: ['my-topic'],
        targetTopicPattern: 'projects/pid/topics/tid',
        mapToTopic: expect.any(Function),
        mapToAttributes: expect.any(Function),
      },
      {
        id: 'subKey2',
        sourceTopics: ['my-topic-1', 'my-topic-2'],
        targetTopicPattern: 'projects/pid/topics/tid.{{ event.topic }}',
        mapToTopic: expect.any(Function),
        mapToAttributes: expect.any(Function),
      },
    ]);

    expect(
      result[0].mapToTopic({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { attr: 'yes' },
      }),
    ).toEqual({ project: 'pid', topic: 'tid' });
    expect(
      result[0].mapToAttributes({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { attr: 'yes' },
      }),
    ).toEqual({ attr: 'yes' });
  });

  it('fills in placeholders', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            eventConsumingGooglePubSubPublisher: {
              subscriptions: {
                sub1: {
                  sourceTopic: 'my-topic',
                  targetTopicName: 'projects/pid/topics/tid.{{ event.topic }}',
                  messageAttributes: {
                    attr1: 'updated.{{ event.metadata.exists }}',
                    attr2: 'updated.{{ event.metadata.missing }}',
                  },
                },
                sub2: {
                  sourceTopic: 'my-topic',
                  targetTopicName:
                    'projects/pid/topics/tid.{{ event.metadata.missing }}',
                  messageAttributes: {
                    attr3: 'new',
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
        sourceTopics: ['my-topic'],
        targetTopicPattern: 'projects/pid/topics/tid.{{ event.topic }}',
        mapToTopic: expect.any(Function),
        mapToAttributes: expect.any(Function),
      },
      {
        id: 'sub2',
        sourceTopics: ['my-topic'],
        targetTopicPattern:
          'projects/pid/topics/tid.{{ event.metadata.missing }}',
        mapToTopic: expect.any(Function),
        mapToAttributes: expect.any(Function),
      },
    ]);

    expect(
      result[0].mapToTopic({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { exists: 'exists', attr1: 'original1', attr2: 'original2' },
      }),
    ).toEqual({ project: 'pid', topic: 'tid.a' }); // Message attribute existed, successfully routed
    expect(
      result[0].mapToAttributes({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { exists: 'exists', attr1: 'original1', attr2: 'original2' },
      }),
    ).toEqual({
      exists: 'exists',
      attr1: 'updated.exists', // message attribute existed, was replaced
      attr2: 'original2', // message attribute did not exist, was not replaced
    });

    expect(
      result[1].mapToTopic({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { exists: 'exists', attr1: 'original1', attr2: 'original2' },
      }),
    ).toBeUndefined(); // Message attribute did not exist, could not be routed
    expect(
      result[1].mapToAttributes({
        topic: 'a',
        eventPayload: { foo: 'bar' },
        metadata: { exists: 'exists', attr1: 'original1', attr2: 'original2' },
      }),
    ).toEqual({
      exists: 'exists',
      attr1: 'original1',
      attr2: 'original2',
      attr3: 'new',
    });
  });

  it('rejects malformed subscription name', () => {
    const data = {
      events: {
        modules: {
          googlePubSub: {
            eventConsumingGooglePubSubPublisher: {
              subscriptions: {
                subKey: {
                  sourceTopic: 'sid',
                  targetTopicName: 'foo',
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
      `"Expected Google Pub/Sub 'targetTopicName' to be on the form 'projects/PROJECT_ID/topics/TOPIC_ID' but got 'foo'"`,
    );
  });
});
