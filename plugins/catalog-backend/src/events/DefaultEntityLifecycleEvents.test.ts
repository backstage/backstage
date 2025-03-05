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
import { EventsService } from '@backstage/plugin-events-node';
import { DefaultEntityLifecycleEvents } from './DefaultEntityLifecycleEvents';
import { ConfigReader } from '@backstage/config';
import { CATALOG_ENTITY_LIFECYCLE_TOPIC } from '../constants';

describe('DefaultEntityLifecycleEvents', () => {
  const mockEventsService: jest.Mocked<EventsService> = {
    publish: jest.fn(),
    subscribe: jest.fn(),
  };

  const defaultEntityLifecycleEvents = DefaultEntityLifecycleEvents.fromConfig(
    new ConfigReader({ catalog: { publishEntityLifecycleEvents: true } }),
    { events: mockEventsService },
  )!;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    {
      description: 'undefined when publishEntityLifecycleEvents is undefined',
      expectedResult: undefined,
      config: {},
    },
    {
      description: 'undefined when publishEntityLifecycleEvents is false',
      expectedResult: undefined,
      config: { catalog: { publishEntityLifecycleEvents: false } },
    },
    {
      description:
        'an instance of DefaultEntityLifecycleEvents when publishEntityLifecycleEvents is true',
      expectedResult: expect.any(DefaultEntityLifecycleEvents),
      config: { catalog: { publishEntityLifecycleEvents: true } },
    },
  ])('returns $description', ({ config, expectedResult }) => {
    const result = DefaultEntityLifecycleEvents.fromConfig(
      new ConfigReader(config),
      { events: mockEventsService },
    );
    expect(result).toEqual(expectedResult);
  });

  it('publishes upsert events when passed entity refs', async () => {
    await defaultEntityLifecycleEvents.publishUpsertedEvent(['u1', 'u2', 'u3']);
    expect(mockEventsService.publish).toHaveBeenCalledWith({
      eventPayload: { action: 'upserted', entityRefs: ['u1', 'u2', 'u3'] },
      topic: CATALOG_ENTITY_LIFECYCLE_TOPIC,
    });
  });

  it('publishes delete events when passed entity refs', async () => {
    await defaultEntityLifecycleEvents.publishDeletedEvent(['d1', 'd2', 'd3']);
    expect(mockEventsService.publish).toHaveBeenCalledWith({
      eventPayload: { action: 'deleted', entityRefs: ['d1', 'd2', 'd3'] },
      topic: CATALOG_ENTITY_LIFECYCLE_TOPIC,
    });
  });

  it('does not publish events when called without entity refs', async () => {
    await defaultEntityLifecycleEvents.publishUpsertedEvent([]);
    await defaultEntityLifecycleEvents.publishDeletedEvent([]);
    expect(mockEventsService.publish).not.toHaveBeenCalled();
  });
});
