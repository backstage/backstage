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
  createServiceFactory,
  ServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  TracingService,
  TracingServiceAttributeValue,
  TracingServiceBaggage,
  TracingServiceContext,
  TracingServiceContextAPI,
  TracingServicePropagationAPI,
  TracingServiceSpan,
  TracingServiceSpanStatus,
  tracingServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { tracingServiceFactory } from '@backstage/backend-defaults/alpha';

// Internal context shape used by the mock. The opaque `TracingServiceContext`
// is just this object cast to the public type.
interface MockContext {
  baggage?: TracingServiceBaggage;
}

function toMockContext(ctx: TracingServiceContext): MockContext {
  return ctx as unknown as MockContext;
}
function fromMockContext(ctx: MockContext): TracingServiceContext {
  return ctx as unknown as TracingServiceContext;
}

// Parses the `baggage` header per the W3C Baggage member syntax,
// dropping value properties (`;property=value`). This mirrors what
// `propagation.extract` does in the real tracing service, just enough
// for tests to assert end-to-end behaviour between propagated headers
// and `getActiveBaggage()`.
function parseBaggageHeader(
  carrier: Record<string, string | string[] | undefined>,
): TracingServiceBaggage | undefined {
  let raw: string | undefined;
  for (const [name, value] of Object.entries(carrier)) {
    if (name.toLowerCase() !== 'baggage') continue;
    raw = Array.isArray(value) ? value[0] : value;
    break;
  }
  if (!raw) return undefined;

  const entries = new Map<string, { value: string }>();
  for (const segment of raw.split(',')) {
    const [pair] = segment.split(';');
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = decodeURIComponent(pair.slice(0, eqIdx).trim());
    const value = decodeURIComponent(pair.slice(eqIdx + 1).trim());
    if (!key) continue;
    entries.set(key, { value });
  }
  if (entries.size === 0) return undefined;

  return {
    getAllEntries: () => Array.from(entries.entries()),
  };
}

/**
 * A jest-mocked span captured by {@link TracingServiceMock}.
 *
 * @alpha
 */
export interface MockedTracingServiceSpan extends TracingServiceSpan {
  setAttribute: jest.Mock<void, [string, TracingServiceAttributeValue]>;
  setStatus: jest.Mock<void, [TracingServiceSpanStatus]>;
}

/**
 * Jest-mocked counterpart of the `context` member on the
 * `TracingService`.
 *
 * @alpha
 */
export interface MockedTracingServiceContextAPI
  extends TracingServiceContextAPI {
  active: jest.MockedFunction<TracingServiceContextAPI['active']>;
  with: jest.MockedFunction<TracingServiceContextAPI['with']>;
}

/**
 * Jest-mocked counterpart of the `propagation` member on the
 * `TracingService`.
 *
 * @alpha
 */
export interface MockedTracingServicePropagationAPI
  extends TracingServicePropagationAPI {
  extract: jest.MockedFunction<TracingServicePropagationAPI['extract']>;
  getBaggage: jest.MockedFunction<TracingServicePropagationAPI['getBaggage']>;
  getActiveBaggage: jest.MockedFunction<
    TracingServicePropagationAPI['getActiveBaggage']
  >;
}

/**
 * Mock for the `TracingService`. Captures every span created via
 * `startActiveSpan` so tests can assert on the options passed in and the
 * methods called on the span inside the callback.
 *
 * By default, `propagation.extract` parses the `baggage` header (W3C
 * Baggage syntax) out of the supplied carrier and stashes the entries
 * on the returned context handle. `context.with` activates that handle
 * for the duration of the wrapped callback so
 * `propagation.getActiveBaggage` (and `propagation.getBaggage` on the
 * supplied handle) returns those entries. Other propagation fields
 * (e.g. `traceparent`) are ignored. Tests that need fully custom
 * baggage can still override `propagation.getActiveBaggage` via
 * `mockReturnValue` / `mockImplementation`, which takes precedence over
 * the default behaviour.
 *
 * Unlike the real `DefaultTracingService`, the mock's `startActiveSpan`
 * does **not** resolve `options.credentials` from `options.request` via
 * `httpAuth`. Tests that need principal-derived span attributes should
 * supply `options.credentials` directly on the span options, or assert
 * on the raw `options` captured by `startActiveSpan.mock.calls`.
 *
 * @alpha
 */
export interface TracingServiceMock extends TracingService {
  startActiveSpan: jest.MockedFunction<TracingService['startActiveSpan']>;
  context: MockedTracingServiceContextAPI;
  propagation: MockedTracingServicePropagationAPI;
  /** Spans created by `startActiveSpan` calls, in order. */
  spans: MockedTracingServiceSpan[];
  factory: ServiceFactory<TracingService>;
}

/**
 * @alpha
 */
export namespace tracingServiceMock {
  /**
   * Returns the real `tracingServiceFactory` from `@backstage/backend-defaults`,
   * for tests that want the full default implementation.
   */
  export const factory = () => tracingServiceFactory;

  /**
   * Builds a mock `TracingService` backed by jest mocks.
   */
  export const mock = (): TracingServiceMock => {
    const spans: MockedTracingServiceSpan[] = [];
    const startActiveSpan = jest.fn(
      async (
        _name: string,
        optionsOrFn: unknown,
        maybeFn?: (span: MockedTracingServiceSpan) => unknown,
      ) => {
        const fn = (
          typeof optionsOrFn === 'function' ? optionsOrFn : maybeFn
        ) as (span: MockedTracingServiceSpan) => unknown;
        const span: MockedTracingServiceSpan = {
          setAttribute: jest.fn(),
          setStatus: jest.fn(),
        };
        spans.push(span);
        return await fn(span);
      },
    ) as unknown as TracingServiceMock['startActiveSpan'];

    const contextStack: MockContext[] = [{}];

    const active = jest.fn(() =>
      fromMockContext(contextStack[contextStack.length - 1]),
    ) as MockedTracingServiceContextAPI['active'];

    const withFn = jest.fn(async (ctx, fn) => {
      contextStack.push(toMockContext(ctx));
      try {
        return await fn();
      } finally {
        contextStack.pop();
      }
    }) as MockedTracingServiceContextAPI['with'];

    const extract = jest.fn((ctx, carrier) => {
      const baggage = parseBaggageHeader(carrier);
      // Carry forward the parsed baggage; preserve any baggage already on the
      // supplied handle if the carrier doesn't include one.
      const base = toMockContext(ctx);
      return fromMockContext({ baggage: baggage ?? base.baggage });
    }) as MockedTracingServicePropagationAPI['extract'];

    const getBaggage = jest.fn(
      ctx => toMockContext(ctx).baggage,
    ) as MockedTracingServicePropagationAPI['getBaggage'];

    const getActiveBaggage = jest.fn(
      () => contextStack[contextStack.length - 1].baggage,
    ) as MockedTracingServicePropagationAPI['getActiveBaggage'];

    const context: MockedTracingServiceContextAPI = {
      active,
      with: withFn,
    };
    const propagation: MockedTracingServicePropagationAPI = {
      extract,
      getBaggage,
      getActiveBaggage,
    };

    const service: TracingService = {
      startActiveSpan,
      context,
      propagation,
    };

    return Object.assign(service as TracingServiceMock, {
      context,
      propagation,
      spans,
      factory: createServiceFactory({
        service: tracingServiceRef,
        deps: {},
        factory: () => service,
      }),
    });
  };
}
