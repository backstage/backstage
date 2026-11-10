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

import type { AuditorEvent } from '@backstage/backend-plugin-api';
import {
  createAuditPipeline,
  createFanOutAuditSink,
  createRedactMetaStage,
  createSanitizeRequestStage,
  createTruncateMetaStage,
  reportAuditError,
  serializeAuditError,
} from './pipeline';

function testEvent(
  overrides: Omit<Partial<AuditorEvent>, 'status'> = {},
): AuditorEvent {
  return {
    id: 'event-id',
    plugin: 'test',
    eventId: 'test-event',
    severityLevel: 'low',
    actor: {},
    status: 'initiated',
    ...overrides,
  };
}

describe('sanitizeRequest stage', () => {
  it('should strip the query string when enabled', () => {
    const stage = createSanitizeRequestStage(true);
    const event = testEvent({
      request: { url: '/api/entities?filter=x&token=secret', method: 'GET' },
    });

    expect(stage(event).request).toEqual({
      url: '/api/entities',
      method: 'GET',
    });
  });

  it('should keep the query string when disabled and leave events without a request alone', () => {
    const stage = createSanitizeRequestStage(false);
    const event = testEvent({
      request: { url: '/api/entities?filter=x', method: 'GET' },
    });

    expect(stage(event).request).toEqual({
      url: '/api/entities?filter=x',
      method: 'GET',
    });
    expect(stage(testEvent()).request).toBeUndefined();
  });
});

describe('redactMeta stage', () => {
  it('should redact denylisted keys recursively and case-insensitively', () => {
    const stage = createRedactMetaStage(new Set(['password', 'secret']));
    const event = testEvent({
      meta: {
        password: 'hunter2',
        nested: { SECRET: 'shh', safe: 'value' },
        list: [{ password: 'x' }, 'kept'],
      },
    });

    expect(stage(event).meta).toEqual({
      password: '[REDACTED]',
      nested: { SECRET: '[REDACTED]', safe: 'value' },
      list: [{ password: '[REDACTED]' }, 'kept'],
    });
  });

  it('should leave meta absent when there is none', () => {
    expect(createRedactMetaStage(new Set(['password']))(testEvent()).meta).toBe(
      undefined,
    );
  });
});

describe('truncateMeta stage', () => {
  it('should truncate long strings recursively and disable with -1', () => {
    const event = testEvent({
      meta: {
        long: 'a'.repeat(10),
        nested: { long: 'b'.repeat(10) },
        list: ['c'.repeat(10)],
      },
    });

    expect(createTruncateMetaStage(4)(event).meta).toEqual({
      long: 'aaaa',
      nested: { long: 'bbbb' },
      list: ['cccc'],
    });

    expect(createTruncateMetaStage(-1)(event).meta).toEqual(event.meta);
  });
});

describe('fan-out sink', () => {
  it('should isolate per-sink failures and contain throwing error callbacks', async () => {
    const onError = jest.fn(() => {
      throw new Error('callback failure');
    });
    const goodSink = { write: jest.fn(async () => {}) };
    const badSink = {
      write: jest.fn(async () => {
        throw new Error('sink failure');
      }),
    };

    await expect(
      createFanOutAuditSink([goodSink, badSink], onError).write(testEvent()),
    ).resolves.toBeUndefined();

    expect(goodSink.write).toHaveBeenCalledTimes(1);
    expect(badSink.write).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe('audit pipeline', () => {
  it('should apply stages in order and write the result to the sink', async () => {
    const sink = { write: jest.fn(async () => {}) };
    const pipeline = createAuditPipeline({
      stages: [
        createSanitizeRequestStage(true),
        createRedactMetaStage(new Set(['password'])),
        createTruncateMetaStage(4),
      ],
      sink,
    });

    await pipeline.emit(
      testEvent({
        request: { url: '/api/entities?filter=x', method: 'GET' },
        meta: { password: 'hunter2', safe: 'value' },
      }),
    );

    expect(sink.write).toHaveBeenCalledWith(
      expect.objectContaining({
        request: { url: '/api/entities', method: 'GET' },
        meta: { password: '[REDACTED]', safe: 'valu' },
      }),
    );
  });
});

describe('serializeAuditError', () => {
  it('should serialize a live error', () => {
    const error = new Error('error');
    expect(serializeAuditError(error)).toEqual({
      name: 'Error',
      message: 'error',
      stack: expect.any(String),
    });
  });
});

describe('reportAuditError', () => {
  it('should contain a throwing error callback', () => {
    expect(() =>
      reportAuditError(new Error('failure'), () => {
        throw new Error('callback failure');
      }),
    ).not.toThrow();
  });
});
