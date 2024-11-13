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

import { DefaultEventsService } from './DefaultEventsService';
import { EventParams } from './EventParams';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';

describe('DefaultEventsService', () => {
  it('passes events to interested subscribers', async () => {
    const logger = mockServices.logger.mock();
    const events = DefaultEventsService.create({ logger });
    const eventsSubscriber1: EventParams[] = [];
    const eventsSubscriber2: EventParams[] = [];

    await events.subscribe({
      id: 'subscriber1',
      topics: ['topicA', 'topicB'],
      onEvent: async event => {
        eventsSubscriber1.push(event);
      },
    });
    await events.subscribe({
      id: 'subscriber2',
      topics: ['topicB', 'topicC'],
      onEvent: async event => {
        eventsSubscriber2.push(event);
      },
    });
    await events.publish({
      topic: 'topicA',
      eventPayload: { test: 'topicA' },
    });
    await events.publish({
      topic: 'topicB',
      eventPayload: { test: 'topicB' },
    });
    await events.publish({
      topic: 'topicC',
      eventPayload: { test: 'topicC' },
    });
    await events.publish({
      topic: 'topicD',
      eventPayload: { test: 'topicD' },
    });

    expect(eventsSubscriber1).toEqual([
      { topic: 'topicA', eventPayload: { test: 'topicA' } },
      { topic: 'topicB', eventPayload: { test: 'topicB' } },
    ]);
    expect(eventsSubscriber2).toEqual([
      { topic: 'topicB', eventPayload: { test: 'topicB' } },
      { topic: 'topicC', eventPayload: { test: 'topicC' } },
    ]);
  });

  it('logs errors from subscribers', async () => {
    const topic = 'testTopic';

    const logger = mockServices.logger.mock();
    const warnSpy = jest.spyOn(logger, 'warn');
    const events = DefaultEventsService.create({ logger });

    await events.subscribe({
      id: 'subscriber1',
      topics: [topic],
      onEvent: event => {
        throw new Error(`NOPE ${event.eventPayload}`);
      },
    });
    await events.publish({ topic, eventPayload: '1' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber1" failed to process event for topic "testTopic"',
      new Error('NOPE 1'),
    );

    await events.subscribe({
      id: 'subscriber2',
      topics: [topic],
      onEvent: event => {
        throw new Error(`NOPE ${event.eventPayload}`);
      },
    });
    await events.publish({ topic, eventPayload: '2' });

    // With two subscribers we should not halt on the first error but call all subscribers
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber1" failed to process event for topic "testTopic"',
      new Error('NOPE 2'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber2" failed to process event for topic "testTopic"',
      new Error('NOPE 2'),
    );
  });

  describe('with event bus', () => {
    const mswServer = setupServer();
    registerMswTestHooks(mswServer);

    it('should read events from events bus API', async () => {
      const logger = mockServices.logger.mock();
      const service = DefaultEventsService.create({ logger }).forPlugin('a', {
        auth: mockServices.auth(),
        logger,
        discovery: mockServices.discovery(),
        lifecycle: mockServices.lifecycle.mock(),
      });

      mswServer.use(
        rest.put(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester',
          (_req, res, ctx) => res(ctx.status(200)),
        ),
        rest.get(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester/events',
          (_req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                events: [{ topic: 'test', payload: { foo: 'bar' } }],
              }),
            ),
        ),
      );

      const event = await new Promise(resolve => {
        service.subscribe({
          id: 'tester',
          topics: ['test'],
          async onEvent(newEvent) {
            resolve(newEvent);
          },
        });
      });

      expect(event).toEqual({ topic: 'test', eventPayload: { foo: 'bar' } });

      // Internal call to clean up subscriptions
      await (service as any).shutdown();
    });

    it('should wait an poll on timeout', async () => {
      const logger = mockServices.logger.mock();
      const service = DefaultEventsService.create({ logger }).forPlugin('a', {
        auth: mockServices.auth(),
        logger,
        discovery: mockServices.discovery(),
        lifecycle: mockServices.lifecycle.mock(),
      });

      let callCount = 0;

      let blockingController: ReadableStreamDefaultController;
      const blockingStream = new ReadableStream({
        start(controller) {
          blockingController = controller;
        },
      });

      mswServer.use(
        rest.put(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester',
          (_req, res, ctx) => res(ctx.status(200)),
        ),
        // The first and third calls result in a blocking 202 that is resolved after 100ms
        // The second and fourth calls result in a 200 with an event
        // The fifth call blocks until the end of the test
        // No more than 5 calls should be made
        rest.get(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester/events',
          (_req, res, ctx) => {
            callCount += 1;
            if (callCount === 1 || callCount === 3) {
              return res(
                ctx.status(202),
                ctx.body(
                  new ReadableStream({
                    start(controller) {
                      setTimeout(() => controller.close(), 100);
                    },
                  }),
                ),
              );
            } else if (callCount === 2 || callCount === 4) {
              return res(
                ctx.status(200),
                ctx.json({
                  events: [{ topic: 'test', payload: { callCount } }],
                }),
              );
            } else if (callCount === 5) {
              return res(ctx.status(202), ctx.body(blockingStream));
            }
            throw new Error(`events endpoint called too many times`);
          },
        ),
      );

      const event = await new Promise(resolve => {
        const events = new Array<EventParams>();
        service.subscribe({
          id: 'tester',
          topics: ['test'],
          async onEvent(newEvent) {
            events.push(newEvent);
            if (events.length === 2) {
              resolve(events);
            }
          },
        });
      });

      expect(event).toEqual([
        { topic: 'test', eventPayload: { callCount: 2 } },
        { topic: 'test', eventPayload: { callCount: 4 } },
      ]);

      // Wait to make sure no additional calls happen
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(callCount).toBe(5);

      // Internal call to clean up subscriptions
      await (service as any).shutdown();

      // Close the stream for the 5th call so that we don't leave the request hanging
      blockingController!.close();
    });

    it('should not read events from bus if disabled', async () => {
      const logger = mockServices.logger.mock();
      const service = DefaultEventsService.create({
        logger,
        useEventBus: 'never',
      }).forPlugin('a', {
        auth: mockServices.auth(),
        logger,
        discovery: mockServices.discovery(),
        lifecycle: mockServices.lifecycle.mock(),
      });

      let calledApi = false;
      mswServer.use(
        rest.put(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester',
          (_req, res, ctx) => {
            calledApi = true;
            res(ctx.status(200));
          },
        ),
      );

      await service.subscribe({
        id: 'tester',
        topics: ['test'],
        async onEvent() {
          expect('not').toBe('reached');
        },
      });

      // Internal call to clean up subscriptions, and wait for the API call
      await (service as any).shutdown();

      expect(calledApi).toBe(false);
    });

    it('should deactivate event bus on 404', async () => {
      expect.assertions(1);

      const logger = mockServices.logger.mock();
      const service = DefaultEventsService.create({ logger }).forPlugin('a', {
        auth: mockServices.auth(),
        logger,
        discovery: mockServices.discovery(),
        lifecycle: mockServices.lifecycle.mock(),
      });

      mswServer.use(
        rest.put(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester',
          (_req, res, ctx) => res(ctx.status(404)),
        ),
      );

      service.subscribe({
        id: 'tester',
        topics: ['test'],
        async onEvent() {
          expect('not').toBe('reached');
        },
      });

      const msg = await new Promise(resolve => {
        logger.warn.mockImplementationOnce(resolve);
      });

      expect(msg).toMatch(/Event subscribe request failed with status 404/);

      // Internal call to clean up subscriptions
      await (service as any).shutdown();
    });

    it('should not deactivate event bus if configured to always be used', async () => {
      expect.assertions(1);

      const logger = mockServices.logger.mock();
      const service = DefaultEventsService.create({
        logger,
        useEventBus: 'always',
      }).forPlugin('a', {
        auth: mockServices.auth(),
        logger,
        discovery: mockServices.discovery(),
        lifecycle: mockServices.lifecycle.mock(),
      });

      mswServer.use(
        rest.put(
          'http://localhost:0/api/events/bus/v1/subscriptions/a.tester',
          (_req, res, ctx) => res(ctx.status(404)),
        ),
      );

      service.subscribe({
        id: 'tester',
        topics: ['test'],
        async onEvent() {
          expect('not').toBe('reached');
        },
      });

      const msg = await new Promise(resolve => {
        logger.warn.mockImplementationOnce(resolve);
      });

      expect(msg).toMatch(
        'Poll failed for subscription "a.tester", retrying in 1000ms',
      );

      // Internal call to clean up subscriptions
      await (service as any).shutdown();
    });
  });
});
