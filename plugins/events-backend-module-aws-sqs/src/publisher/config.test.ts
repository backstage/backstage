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

import { ConfigReader } from '@backstage/config';
import { readConfig } from './config';

describe('readConfig', () => {
  it('not configured', () => {
    const config = new ConfigReader({});

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs.length).toBe(0);
  });

  it('only required fields configured', () => {
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

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs.length).toBe(2);

    expect(publisherConfigs[0].topic).toEqual('fake1');
    expect(publisherConfigs[0].region).toEqual('eu-west-1');
    expect(publisherConfigs[0].queueUrl).toEqual('https://fake1.queue.url');
    expect(publisherConfigs[0].pollingWaitTime.as('seconds')).toBe(20);
    expect(publisherConfigs[0].timeout.as('seconds')).toBe(260);
    expect(publisherConfigs[0].waitTimeAfterEmptyReceive.as('seconds')).toBe(
      60,
    );
  });

  it('all fields configured', () => {
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
                    visibilityTimeout: { minutes: 5 },
                    waitTime: { seconds: 10 },
                  },
                  timeout: { minutes: 5 },
                  waitTimeAfterEmptyReceive: { seconds: 30 },
                },
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs.length).toBe(1);

    expect(publisherConfigs[0].topic).toEqual('fake1');
    expect(publisherConfigs[0].region).toEqual('eu-west-1');
    expect(publisherConfigs[0].queueUrl).toEqual('https://fake1.queue.url');
    expect(publisherConfigs[0].pollingWaitTime.as('seconds')).toBe(10);
    expect(publisherConfigs[0].timeout.as('seconds')).toBe(300);
    expect(publisherConfigs[0].waitTimeAfterEmptyReceive.as('seconds')).toBe(
      30,
    );
  });

  it('fail on negative queue.waitTime', () => {
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
                    visibilityTimeout: { minutes: 5 },
                    waitTime: { seconds: -10 },
                  },
                  timeout: { minutes: 5 },
                  waitTimeAfterEmptyReceive: { seconds: 30 },
                },
              },
            },
          },
        },
      },
    });

    expect(() => readConfig(config)).toThrow(
      'events.modules.awsSqs.awsSqsConsumingEventPublisher.topics.fake1.queue.waitTime must be within 0..20 seconds',
    );
  });

  it('fail on too high queue.waitTime', () => {
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
                    visibilityTimeout: { minutes: 5 },
                    waitTime: { seconds: 30 },
                  },
                  timeout: { minutes: 5 },
                  waitTimeAfterEmptyReceive: { seconds: 30 },
                },
              },
            },
          },
        },
      },
    });

    expect(() => readConfig(config)).toThrow(
      'events.modules.awsSqs.awsSqsConsumingEventPublisher.topics.fake1.queue.waitTime must be within 0..20 seconds',
    );
  });

  it('fail on too low timeout', () => {
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
                    visibilityTimeout: { minutes: 5 },
                    waitTime: { seconds: 10 },
                  },
                  timeout: { seconds: 10 },
                  waitTimeAfterEmptyReceive: { seconds: 30 },
                },
              },
            },
          },
        },
      },
    });

    expect(() => readConfig(config)).toThrow(
      'The events.modules.awsSqs.awsSqsConsumingEventPublisher.topics.fake1.timeout must be greater than events.modules.awsSqs.awsSqsConsumingEventPublisher.topics.fake1.queue.waitTime',
    );
  });

  it('fail on negative waitTimeAfterEmptyReceive', () => {
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
                    visibilityTimeout: { minutes: 5 },
                    waitTime: { seconds: 10 },
                  },
                  timeout: { minutes: 5 },
                  waitTimeAfterEmptyReceive: { seconds: -30 },
                },
              },
            },
          },
        },
      },
    });

    expect(() => readConfig(config)).toThrow(
      'The events.modules.awsSqs.awsSqsConsumingEventPublisher.topics.fake1.waitTimeAfterEmptyReceive must not be negative',
    );
  });
});
