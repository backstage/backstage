/*
 * Copyright 2024 The Backstage Authors
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
import {
  TraceFlags,
  context,
  trace,
  type SpanContext,
} from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import type { AuditorEvent } from '@backstage/backend-plugin-api';
import type { Response } from 'express';
import { EventEmitter } from 'node:events';
import { DefaultAuditorService } from './DefaultAuditorService';
import { createFanOutAuditSink } from './pipeline';
import { DEFAULT_REDACT_META_KEYS } from './utils';

// attachToResponse finalizes without returning a promise, so tests flush the
// pending terminal emission before asserting against the sink
const flushAsync = () => new Promise(resolve => setImmediate(resolve));

function createMockResponse(options: {
  statusCode: number;
  writableFinished?: boolean;
}) {
  const res = new EventEmitter() as unknown as Response;
  Object.defineProperty(res, 'statusCode', {
    get: () => options.statusCode,
  });
  Object.defineProperty(res, 'writableFinished', {
    get: () => options.writableFinished ?? true,
  });
  return res;
}

const TEST_SPAN_CONTEXT: SpanContext = {
  traceId: '0af7651916cd43dd8448eb211c80319c',
  spanId: 'b7ad6b7169203331',
  traceFlags: TraceFlags.SAMPLED,
};

const withTestSpan = <T>(fn: () => Promise<T>): Promise<T> =>
  context.with(
    trace.setSpan(context.active(), trace.wrapSpanContext(TEST_SPAN_CONTEXT)),
    fn,
  );

const mockDeps = {
  auth: mockServices.auth.mock(),
  httpAuth: mockServices.httpAuth.mock(),
  plugin: {
    getId: () => 'test',
  },
};

// The OpenTelemetry API is a no-op without a registered context manager;
// register one so that context.with() activates spans for these tests
beforeAll(() => {
  context.setGlobalContextManager(new AsyncLocalStorageContextManager());
});
afterAll(() => {
  context.disable();
});

describe('DefaultAuditorService', () => {
  it('creates a auditor instance with default options', () => {
    const auditor = DefaultAuditorService.create(
      { write: async () => {} },
      mockDeps,
    );
    expect(auditor).toBeInstanceOf(DefaultAuditorService);
  });

  it('should log a status "initiated" using createEvent', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    await auditor.createEvent({
      eventId: 'test-event',
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'initiated',
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should thread one event id through the lifecycle', async () => {
    const sink = { write: jest.fn(async () => {}) };
    const auditor = DefaultAuditorService.create(sink, mockDeps);

    const successEvent = await auditor.createEvent({ eventId: 'test-event' });
    expect(successEvent.id).toEqual(expect.any(String));
    await successEvent.success();

    const failEvent = await auditor.createEvent({ eventId: 'test-event' });
    expect(failEvent.id).not.toBe(successEvent.id);
    await failEvent.fail({ error: new Error('error') });

    expect(sink.write).toHaveBeenCalledTimes(4);
    expect(sink.write).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: successEvent.id, status: 'initiated' }),
    );
    expect(sink.write).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: successEvent.id, status: 'succeeded' }),
    );
    expect(sink.write).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ id: failEvent.id, status: 'initiated' }),
    );
    expect(sink.write).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ id: failEvent.id, status: 'failed' }),
    );
  });

  it('should serialize errors before they reach the sink', async () => {
    const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
    const auditor = DefaultAuditorService.create(sink, mockDeps);

    const error = new Error('error');
    const auditorEvent = await auditor.createEvent({ eventId: 'test-event' });
    await auditorEvent.fail({ error });

    const emitted = sink.write.mock.calls[1][0];
    expect(emitted.status).toBe('failed');
    const failed = emitted as Extract<AuditorEvent, { status: 'failed' }>;
    expect(failed.error).toEqual({
      name: 'Error',
      message: 'error',
      stack: expect.any(String),
    });
    expect(failed.error).not.toBeInstanceOf(Error);
  });

  it('should log a status "succeeded" using createEvent', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    await auditorEvent.success();

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should log a status "failed"', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    const error = new Error('error');
    await auditorEvent.fail({ error });

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'failed',
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should only use the first terminal call', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
    });

    await auditorEvent.success();
    await auditorEvent.fail({ error: new Error('error') });
    await auditorEvent.success();

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should merge meta from update and terminal calls', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: { initiated: 'test' },
    });

    auditorEvent.update({ midflight: 'test' });
    await auditorEvent.success({ meta: { succeeded: 'test' } });

    // update after the event is finalized is a no-op
    auditorEvent.update({ ignored: 'test' });

    expect(logFn).toHaveBeenCalledTimes(2);
    expect(logFn).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'initiated',
        meta: { initiated: 'test' },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
    expect(logFn).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        meta: {
          initiated: 'test',
          midflight: 'test',
          succeeded: 'test',
        },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should let terminal meta take precedence over createEvent and update meta', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: { state: 'created', keep: 'kept' },
    });

    auditorEvent.update({ state: 'updated', extra: 'added' });
    await auditorEvent.success({ meta: { state: 'terminal' } });

    expect(logFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        meta: {
          state: 'terminal',
          keep: 'kept',
          extra: 'added',
        },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should use root meta', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const successEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });

    await successEvent.success({ meta: { succeeded: 'test' } });

    const failEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        initiated: 'test',
      },
    });

    const error = new Error('error');
    await failEvent.fail({ error, meta: { failed: 'test' } });

    expect(logFn).toHaveBeenCalledTimes(4);
    expect(logFn).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'succeeded',
        meta: {
          initiated: 'test',
          succeeded: 'test',
        },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
    expect(logFn).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        eventId: 'test-event',
        status: 'failed',
        meta: {
          initiated: 'test',
          failed: 'test',
        },
        error: {
          name: 'Error',
          message: 'error',
          stack: expect.any(String),
        },
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  it('should pass correlationId and parentEventId to the sink', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    await auditor.createEvent({
      eventId: 'test-event',
      correlationId: 'correlation-id',
      parentEventId: 'parent-event-id',
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        status: 'initiated',
        correlationId: 'correlation-id',
        parentEventId: 'parent-event-id',
        plugin: 'test',
        severityLevel: 'low',
        actor: {},
      }),
    );
  });

  describe('request contexts and actor attribution', () => {
    it('should accept a plain request context without credential resolution', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auth = mockServices.auth.mock();
      const httpAuth = mockServices.httpAuth.mock();
      const auditor = DefaultAuditorService.create(sink, {
        auth,
        httpAuth,
        plugin: mockDeps.plugin,
      });

      await auditor.createEvent({
        eventId: 'test-event',
        request: {
          url: '/api/entities?filter=x',
          method: 'GET',
          ip: '127.0.0.1',
          hostname: 'localhost',
          userAgent: 'test-agent',
        },
      });

      // plain contexts carry their own actor details and resolve no credentials
      expect(auth.getOwnServiceCredentials).not.toHaveBeenCalled();
      expect(httpAuth.credentials).not.toHaveBeenCalled();
      expect(sink.write).toHaveBeenCalledWith(
        expect.objectContaining({
          // the query string is sanitized the same way as for Express requests
          request: { url: '/api/entities', method: 'GET' },
          actor: {
            ip: '127.0.0.1',
            hostname: 'localhost',
            userAgent: 'test-agent',
          },
        }),
      );
    });

    it('should let an explicit actor override the derived one', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auth = mockServices.auth.mock();
      auth.isPrincipal.mockImplementation(
        (_credentials: unknown, kind: string) => kind === 'user',
      );
      const httpAuth = mockServices.httpAuth.mock();
      httpAuth.credentials.mockResolvedValue({
        $$type: '@backstage/BackstageCredentials',
        principal: { type: 'user', userEntityRef: 'user:derived/x' },
      });
      const auditor = DefaultAuditorService.create(sink, {
        auth,
        httpAuth,
        plugin: mockDeps.plugin,
      });

      const request = {
        method: 'GET',
        originalUrl: '/api/entities',
        ip: '127.0.0.1',
        get: (_header: string) => 'derived-agent',
      };

      // without an explicit actor, the credentials win
      await auditor.createEvent({
        eventId: 'derived',
        // @ts-expect-error partial request is fine for this test
        request,
      });
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({
          actor: expect.objectContaining({
            actorId: 'user:derived/x',
            ip: '127.0.0.1',
            userAgent: 'derived-agent',
          }),
        }),
      );

      // with one, the explicit fields win over the derived actor
      await auditor.createEvent({
        eventId: 'explicit',
        // @ts-expect-error partial request is fine for this test
        request,
        actor: { actorId: 'user:explicit/x', ip: '10.0.0.1' },
      });
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({
          actor: expect.objectContaining({
            actorId: 'user:explicit/x',
            ip: '10.0.0.1',
            userAgent: 'derived-agent',
          }),
        }),
      );
    });
  });

  describe('trace correlation', () => {
    it('threads the active span context through the lifecycle emissions', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);

      let event: Awaited<ReturnType<typeof auditor.createEvent>>;
      await withTestSpan(async () => {
        event = await auditor.createEvent({ eventId: 'test-event' });
      });
      // the terminal call happens outside the span context; the values were
      // captured at event creation and are not re-read
      await event!.fail({ error: new Error('error') });

      expect(sink.write).toHaveBeenCalledTimes(2);
      for (const call of sink.write.mock.calls) {
        expect(call[0].traceId).toBe(TEST_SPAN_CONTEXT.traceId);
        expect(call[0].spanId).toBe(TEST_SPAN_CONTEXT.spanId);
      }
    });

    it('omits the trace fields when no span is active', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);

      const event = await auditor.createEvent({ eventId: 'test-event' });
      await event.success();

      expect(sink.write).toHaveBeenCalledTimes(2);
      for (const call of sink.write.mock.calls) {
        expect(call[0].traceId).toBeUndefined();
        expect(call[0].spanId).toBeUndefined();
      }
    });

    it('does not emit trace fields for sampled-out events', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, {
        ...mockDeps,
        sampling: { low: 0 },
      });

      await withTestSpan(async () => {
        const event = await auditor.createEvent({ eventId: 'test-event' });
        await event.success();
      });

      expect(sink.write).not.toHaveBeenCalled();
    });
  });

  describe('attachToResponse', () => {
    it('should succeed when the response finishes with a 2xx status', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);
      const res = createMockResponse({ statusCode: 200 });

      const event = await auditor.createEvent({ eventId: 'test-event' });
      event.attachToResponse(res);
      res.emit('finish');
      await flushAsync();

      expect(sink.write).toHaveBeenCalledTimes(2);
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: 'succeeded',
          meta: { responseStatus: 200 },
        }),
      );
    });

    it('should fail when the response finishes with an error status', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);
      const res = createMockResponse({ statusCode: 503 });

      const event = await auditor.createEvent({ eventId: 'test-event' });
      event.attachToResponse(res);
      res.emit('finish');
      await flushAsync();

      expect(sink.write).toHaveBeenCalledTimes(2);
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: 'failed',
          meta: { responseStatus: 503 },
          error: {
            name: 'Error',
            message: 'Request completed with status 503',
            stack: expect.any(String),
          },
        }),
      );
    });

    it('should fail when the client disconnects before the response completes', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);
      const res = createMockResponse({
        statusCode: 200,
        writableFinished: false,
      });

      const event = await auditor.createEvent({ eventId: 'test-event' });
      event.attachToResponse(res);
      res.emit('close');
      await flushAsync();

      expect(sink.write).toHaveBeenCalledTimes(2);
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: 'failed',
          error: {
            name: 'Error',
            message: 'Client disconnected before response completed',
            stack: expect.any(String),
          },
        }),
      );
    });

    it('should finalize only once when the response settles twice', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);
      const res = createMockResponse({ statusCode: 200 });

      const event = await auditor.createEvent({ eventId: 'test-event' });
      event.attachToResponse(res);
      res.emit('finish');
      res.emit('close');
      await flushAsync();

      // initiated + a single succeeded emission
      expect(sink.write).toHaveBeenCalledTimes(2);
    });

    it('should let a manual terminal call win over the response', async () => {
      const sink = { write: jest.fn(async (_event: AuditorEvent) => {}) };
      const auditor = DefaultAuditorService.create(sink, mockDeps);
      const res = createMockResponse({ statusCode: 500 });

      const event = await auditor.createEvent({ eventId: 'test-event' });
      await event.success();
      event.attachToResponse(res);
      res.emit('finish');
      await flushAsync();

      // initiated + the manual success; the failing response is a no-op
      expect(sink.write).toHaveBeenCalledTimes(2);
      expect(sink.write).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'succeeded' }),
      );
    });
  });

  describe('withEvent', () => {
    it('should emit succeeded and return the result on resolve', async () => {
      const logFn = jest.fn();
      const auditor = DefaultAuditorService.create(logFn, mockDeps);

      const result = await auditor.withEvent(
        { eventId: 'test-event', meta: { initial: 'test' } },
        async event => {
          event.update({ midflight: 'test' });
          return 'result';
        },
      );

      expect(result).toBe('result');
      expect(logFn).toHaveBeenCalledTimes(2);
      expect(logFn).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          eventId: 'test-event',
          meta: { initial: 'test' },
          status: 'initiated',
          plugin: 'test',
          severityLevel: 'low',
          actor: {},
        }),
      );
      expect(logFn).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          eventId: 'test-event',
          meta: { initial: 'test', midflight: 'test' },
          status: 'succeeded',
          plugin: 'test',
          severityLevel: 'low',
          actor: {},
        }),
      );
    });

    it('should emit failed and rethrow on reject', async () => {
      const logFn = jest.fn();
      const auditor = DefaultAuditorService.create(logFn, mockDeps);

      const error = new Error('error');
      await expect(
        auditor.withEvent({ eventId: 'test-event' }, async () => {
          throw error;
        }),
      ).rejects.toBe(error);

      expect(logFn).toHaveBeenCalledTimes(2);
      expect(logFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          eventId: 'test-event',
          status: 'failed',
          error: {
            name: 'Error',
            message: 'error',
            stack: expect.any(String),
          },
          plugin: 'test',
          severityLevel: 'low',
          actor: {},
        }),
      );
    });

    it('should still run the function and rethrow when the event is sampled out', async () => {
      const sink = { write: jest.fn(async () => {}) };
      const auditor = DefaultAuditorService.create(sink, {
        ...mockDeps,
        sampling: { low: 0, medium: 0, high: 0 },
      });

      const result = await auditor.withEvent(
        { eventId: 'test-event' },
        async () => 'result',
      );
      expect(result).toBe('result');

      const error = new Error('error');
      await expect(
        auditor.withEvent({ eventId: 'test-event' }, async () => {
          throw error;
        }),
      ).rejects.toBe(error);

      expect(sink.write).not.toHaveBeenCalled();
    });
  });

  it('should drop sampled-out events before emitting', async () => {
    const sink = { write: jest.fn(async () => {}) };
    const auditor = DefaultAuditorService.create(sink, {
      ...mockDeps,
      sampling: { low: 0 },
    });

    const sampledOutEvent = await auditor.createEvent({
      eventId: 'low-event',
    });
    await sampledOutEvent.success();

    const keptEvent = await auditor.createEvent({
      eventId: 'medium-event',
      severityLevel: 'medium',
    });
    await keptEvent.success();

    expect(sink.write).toHaveBeenCalledTimes(2);
    expect(sink.write).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ eventId: 'medium-event' }),
    );
    expect(sink.write).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        eventId: 'medium-event',
        status: 'succeeded',
      }),
    );
  });

  it('should keep real handle semantics for sampled-out events', async () => {
    const sink = { write: jest.fn(async () => {}) };
    const auditor = DefaultAuditorService.create(sink, {
      ...mockDeps,
      sampling: { low: 0 },
    });

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: { initial: 'test' },
    });

    // the sampled-out handle is the real handle with a dead emitter
    expect(auditorEvent.id).toEqual(expect.any(String));
    auditorEvent.update({ midflight: 'test' });
    await auditorEvent.success();
    await auditorEvent.fail({ error: new Error('error') });

    expect(sink.write).not.toHaveBeenCalled();
  });

  it('should reject sampling critical events away entirely', () => {
    expect(() =>
      DefaultAuditorService.create(
        { write: async () => {} },
        { ...mockDeps, sampling: { critical: 0 } },
      ),
    ).toThrow(
      'Critical audit events cannot be sampled away entirely; the sampling probability for the critical severity must be greater than 0.',
    );
  });

  it('should never reject when the sink throws, even if onError throws too', async () => {
    const onError = jest.fn(() => {
      throw new Error('callback failure');
    });
    const sink = {
      write: jest.fn(async () => {
        throw new Error('sink failure');
      }),
    };
    const auditor = DefaultAuditorService.create(sink, {
      ...mockDeps,
      onError,
    });

    // separate handles for the success and fail paths
    const successEvent = await auditor.createEvent({ eventId: 'success' });
    await expect(successEvent.success()).resolves.toBeUndefined();

    const failEvent = await auditor.createEvent({ eventId: 'fail' });
    await expect(
      failEvent.fail({ error: new Error('error') }),
    ).resolves.toBeUndefined();

    // initiated + success + initiated + fail writes all failed and were reported
    expect(sink.write).toHaveBeenCalledTimes(4);
    expect(onError).toHaveBeenCalledTimes(4);

    // withEvent rethrows the exact original error, not a reporting failure
    const operationError = new Error('operation failure');
    await expect(
      auditor.withEvent({ eventId: 'with-event' }, async () => {
        throw operationError;
      }),
    ).rejects.toBe(operationError);
  });

  it('should isolate per-sink failures in the fan-out sink', async () => {
    const onError = jest.fn();
    const goodSink = { write: jest.fn(async () => {}) };
    const sinkError = new Error('sink failure');
    const badSink = {
      write: jest.fn(async () => {
        throw sinkError;
      }),
    };
    const fanOut = createFanOutAuditSink([goodSink, badSink], onError);

    const event = {
      id: 'event-id',
      plugin: 'test',
      eventId: 'test-event',
      severityLevel: 'low',
      actor: {},
      status: 'initiated',
    } as AuditorEvent;

    await expect(fanOut.write(event)).resolves.toBeUndefined();
    expect(goodSink.write).toHaveBeenCalledWith(event);
    expect(badSink.write).toHaveBeenCalledWith(event);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(sinkError);
  });

  it('should contain credential resolution failures', async () => {
    const credentialError = new Error('credential failure');
    const httpAuth = mockServices.httpAuth.mock({
      credentials: jest.fn(() => {
        throw credentialError;
      }),
    });
    const sink = { write: jest.fn(async () => {}) };
    const onError = jest.fn();
    const auditor = DefaultAuditorService.create(sink, {
      ...mockDeps,
      httpAuth,
      onError,
    });

    const request = { method: 'GET', originalUrl: '/api/entities' };
    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
    });
    await auditorEvent.success();

    expect(sink.write).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError.mock.calls[0][0].cause).toBe(credentialError);
  });

  it('should let the first terminal win while its emission is still in flight', async () => {
    let releaseTerminalWrite!: () => void;
    const terminalWrite = new Promise<void>(resolve => {
      releaseTerminalWrite = resolve;
    });
    const sink = {
      write: jest.fn((event: { status: string }) =>
        event.status === 'initiated' ? Promise.resolve() : terminalWrite,
      ),
    };
    const auditor = DefaultAuditorService.create(sink, mockDeps);

    const auditorEvent = await auditor.createEvent({
      eventId: 'test-event',
      meta: { state: 'created' },
    });

    const successPromise = auditorEvent.success({
      meta: { state: 'terminal' },
    });
    // while the success emission is pending, competing calls must be no-ops
    auditorEvent.update({ state: 'late-update' });
    await auditorEvent.fail({ error: new Error('error') });
    auditorEvent.update({ state: 'late-update-2' });

    releaseTerminalWrite();
    await successPromise;

    expect(sink.write).toHaveBeenCalledTimes(2);
    expect(sink.write).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 'succeeded',
        meta: { state: 'terminal' },
      }),
    );
  });

  it('should strip the query string from request URLs', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    const request = {
      ip: '127.0.0.1',
      hostname: 'localhost',
      method: 'GET',
      originalUrl: '/api/catalog/entities?filter=x&token=secret',
      get: () => undefined,
    };

    await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        request: { url: '/api/catalog/entities', method: 'GET' },
      }),
    );
  });

  it('should keep the query string when sanitization is disabled', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(
      { write: async event => logFn(event) },
      {
        ...mockDeps,
        sanitizeRequestQuery: false,
      },
    );

    const request = {
      ip: '127.0.0.1',
      hostname: 'localhost',
      method: 'GET',
      originalUrl: '/api/catalog/entities?filter=x',
      get: () => undefined,
    };

    await auditor.createEvent({
      eventId: 'test-event',
      // @ts-expect-error partial request is fine for this test
      request,
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        request: {
          url: '/api/catalog/entities?filter=x',
          method: 'GET',
        },
      }),
    );
  });

  it('should truncate long meta strings and redact sensitive keys by default', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(
      { write: async event => logFn(event) },
      {
        ...mockDeps,
        maxMetaStringLength: 10,
      },
    );

    await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        longString: 'a'.repeat(25),
        password: 'hunter2',
        nested: {
          apiToken: 'abc',
          Authorization: 'Bearer x',
          safe: 'value',
          list: [{ secret: 'shh' }, 'short'],
        },
      },
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: {
          longString: 'a'.repeat(10),
          password: '[REDACTED]',
          nested: {
            apiToken: 'abc',
            Authorization: '[REDACTED]',
            safe: 'value',
            list: [{ secret: '[REDACTED]' }, 'short'],
          },
        },
      }),
    );
  });

  it('should pass numeric, boolean and null meta leaves through hygiene', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(logFn, mockDeps);

    await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        count: 3,
        flag: true,
        nothing: null,
        nested: { count: 1, list: [2, false, null] },
      },
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: {
          count: 3,
          flag: true,
          nothing: null,
          nested: { count: 1, list: [2, false, null] },
        },
      }),
    );
  });

  it('should disable truncation with -1 and apply a custom denylist', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(
      { write: async event => logFn(event) },
      {
        ...mockDeps,
        maxMetaStringLength: -1,
        redactMetaKeys: [...DEFAULT_REDACT_META_KEYS, 'custom-key'],
      },
    );

    await auditor.createEvent({
      eventId: 'test-event',
      meta: {
        longString: 'a'.repeat(5000),
        password: 'hunter2',
        'custom-key': 'value',
      },
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: {
          longString: 'a'.repeat(5000),
          password: '[REDACTED]',
          'custom-key': '[REDACTED]',
        },
      }),
    );
  });

  it('should disable redaction with an empty denylist', async () => {
    const logFn = jest.fn();
    const auditor = DefaultAuditorService.create(
      { write: async event => logFn(event) },
      {
        ...mockDeps,
        redactMetaKeys: [],
      },
    );

    await auditor.createEvent({
      eventId: 'test-event',
      meta: { password: 'hunter2' },
    });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining({ meta: { password: 'hunter2' } }),
    );
  });
});
