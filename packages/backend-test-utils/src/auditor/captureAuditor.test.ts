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
  TraceFlags,
  context,
  trace,
  type SpanContext,
} from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { captureAuditor } from './captureAuditor';

const TEST_SPAN_CONTEXT: SpanContext = {
  traceId: '0af7651916cd43dd8448eb211c80319c',
  spanId: 'b7ad6b7169203331',
  traceFlags: TraceFlags.SAMPLED,
};

// The OpenTelemetry API is a no-op without a registered context manager
beforeAll(() => {
  context.setGlobalContextManager(new AsyncLocalStorageContextManager());
});
afterAll(() => {
  context.disable();
});

describe('captureAuditor', () => {
  it('should record the full event lifecycle with merged meta', async () => {
    const { auditor, events } = captureAuditor();

    const event = await auditor.createEvent({
      eventId: 'test-event',
      severityLevel: 'medium',
      meta: { initial: 'test' },
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({
        plugin: 'test',
        eventId: 'test-event',
        severityLevel: 'medium',
        actor: {},
        meta: { initial: 'test' },
        status: 'initiated',
      }),
    );
    expect(events[0].id).toEqual(expect.any(String));
    expect(events[0].id).toBe(event.id);

    event.update({ midflight: 'test' });
    await event.success({ meta: { succeeded: 'test' } });

    expect(events).toHaveLength(2);
    expect(events[1]).toEqual(
      expect.objectContaining({
        id: event.id,
        plugin: 'test',
        eventId: 'test-event',
        severityLevel: 'medium',
        actor: {},
        meta: { initial: 'test', midflight: 'test', succeeded: 'test' },
        status: 'succeeded',
      }),
    );

    // only the first terminal call is recorded
    await event.fail({ error: new Error('error') });
    expect(events).toHaveLength(2);
  });

  it('should record a failed event with its serialized error', async () => {
    const { auditor, events } = captureAuditor();

    const error = new Error('error');
    const event = await auditor.createEvent({ eventId: 'test-event' });
    await event.fail({ error, meta: { failed: 'test' } });

    expect(events).toHaveLength(2);
    expect(events[1]).toEqual(
      expect.objectContaining({
        plugin: 'test',
        eventId: 'test-event',
        severityLevel: 'low',
        actor: {},
        meta: { failed: 'test' },
        status: 'failed',
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
      }),
    );
  });

  it('should capture request actor details without resolving credentials', async () => {
    const { auditor, events } = captureAuditor();

    const request = {
      method: 'GET',
      originalUrl: '/api/entities?filter=x',
      ip: '127.0.0.1',
      hostname: 'localhost',
      get: (name: string) => (name === 'user-agent' ? 'test-agent' : undefined),
    };
    await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
    });

    expect(events).toHaveLength(1);
    expect(events[0].actor).toEqual({
      ip: '127.0.0.1',
      hostname: 'localhost',
      userAgent: 'test-agent',
    });
    // no credential resolution happens, so no actorId is recorded
    expect(events[0].actor.actorId).toBeUndefined();

    const event = await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
    });
    await event.fail({ error: new Error('error') });

    expect(events).toHaveLength(3);
    expect(events[2].actor).toEqual({
      ip: '127.0.0.1',
      hostname: 'localhost',
      userAgent: 'test-agent',
    });
  });

  it('should record request and event linkage details as given', async () => {
    const { auditor, events } = captureAuditor();

    const request = {
      method: 'GET',
      originalUrl: '/api/entities?filter=x',
    };
    await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
      parentEventId: 'parent-event-id',
    });

    expect(events[0].request).toEqual({
      url: '/api/entities?filter=x',
      method: 'GET',
    });
    expect(events[0].parentEventId).toBe('parent-event-id');
  });

  it('should support withEvent success and failure', async () => {
    const { auditor, events } = captureAuditor();

    const result = await auditor.withEvent(
      { eventId: 'success-event' },
      async event => {
        event.update({ midflight: 'test' });
        return 'result';
      },
    );
    expect(result).toBe('result');
    expect(events.map(event => event.status)).toEqual([
      'initiated',
      'succeeded',
    ]);
    expect(events[1].meta).toEqual({ midflight: 'test' });

    const error = new Error('error');
    await expect(
      auditor.withEvent({ eventId: 'fail-event' }, async () => {
        throw error;
      }),
    ).rejects.toThrow(error);
    expect(events.map(event => event.status)).toEqual([
      'initiated',
      'succeeded',
      'initiated',
      'failed',
    ]);
    expect(events[3]).toEqual(
      expect.objectContaining({
        status: 'failed',
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
      }),
    );
  });
  it('carries the active trace and span context through events', async () => {
    const { auditor, events } = captureAuditor();

    await context.with(
      trace.setSpan(context.active(), trace.wrapSpanContext(TEST_SPAN_CONTEXT)),
      async () => {
        await auditor.withEvent({ eventId: 'traced-event' }, async () => {});
      },
    );

    expect(events).toHaveLength(2);
    for (const event of events) {
      expect(event.traceId).toBe(TEST_SPAN_CONTEXT.traceId);
      expect(event.spanId).toBe(TEST_SPAN_CONTEXT.spanId);
    }
  });
});
