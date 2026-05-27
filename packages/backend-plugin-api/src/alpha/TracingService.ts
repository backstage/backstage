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

import type { Request } from 'express';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

/**
 * Attribute values that can be attached to spans.
 *
 * @alpha
 */
export type TracingServiceAttributeValue =
  | string
  | number
  | boolean
  | Array<null | undefined | string>
  | Array<null | undefined | number>
  | Array<null | undefined | boolean>;

/**
 * A set of key-value pairs that can be attached to spans.
 *
 * @alpha
 */
export interface TracingServiceAttributes {
  [key: string]: TracingServiceAttributeValue | undefined;
}

/**
 * The kind of operation a span represents.
 *
 * @alpha
 */
export type TracingServiceSpanKind =
  | 'internal'
  | 'server'
  | 'client'
  | 'producer'
  | 'consumer';

/**
 * The status of a span.
 *
 * @alpha
 */
export interface TracingServiceSpanStatus {
  code: 'unset' | 'ok' | 'error';
  message?: string;
}

/**
 * A trace span. Provided to `startActiveSpan` so
 * additional attributes or status can be set from within the callback.
 *
 * @alpha
 */
export interface TracingServiceSpan {
  setAttribute(key: string, value: TracingServiceAttributeValue): void;
  setStatus(status: TracingServiceSpanStatus): void;
}

/**
 * Options for `startActiveSpan`.
 *
 * @alpha
 */
export interface TracingServiceSpanOptions {
  /** Attributes to attach to the span. */
  attributes?: TracingServiceAttributes;
  /** The kind of span. */
  kind?: TracingServiceSpanKind;
  /**
   * Authenticated principal source for span enrichment. Preferred when
   * both `credentials` and `request` are supplied.
   */
  credentials?: BackstageCredentials;
  /** HTTP request to extract credentials from for span enrichment. */
  request?: Request<any, any, any, any, any>;
}

/**
 * A service for emitting trace spans from a backend plugin.
 *
 * @alpha
 */
export interface TracingService {
  /**
   * Runs `fn` inside a new active span. The span is finished when `fn`
   * resolves or throws.
   */
  startActiveSpan<T>(
    name: string,
    fn: (span: TracingServiceSpan) => T | Promise<T>,
  ): Promise<T>;
  /**
   * Runs `fn` inside a new active span configured by `options`. The
   * span is finished when `fn` resolves or throws.
   */
  startActiveSpan<T>(
    name: string,
    options: TracingServiceSpanOptions,
    fn: (span: TracingServiceSpan) => T | Promise<T>,
  ): Promise<T>;

  /**
   * Read the active tracing context, or run work within a specific
   * one.
   */
  readonly context: TracingServiceContextAPI;

  /**
   * Extract a caller's tracing context from an inbound carrier, and
   * read baggage from a context. Use these to bridge context across
   * boundaries where automatic propagation is lost — for example,
   * when a request arrives over a transport that does not
   * automatically attach the caller's context.
   */
  readonly propagation: TracingServicePropagationAPI;
}

/**
 * Read the active tracing context, or run work within a specific one.
 * The context carries the active span and propagation fields (trace
 * parent, baggage) for the current unit of work, and is automatically
 * inherited by spans created via `startActiveSpan`.
 *
 * @alpha
 */
export interface TracingServiceContextAPI {
  /** Returns the currently active context. */
  active(): TracingServiceContext;
  /** Runs `fn` with the supplied context set as the active context. */
  with<T>(context: TracingServiceContext, fn: () => T | Promise<T>): Promise<T>;
}

/**
 * Extract a caller's trace parent and baggage from an inbound carrier
 * (typically HTTP headers), or read baggage from a context. Use these
 * to bridge context across boundaries where automatic propagation is
 * lost.
 *
 * @alpha
 */
export interface TracingServicePropagationAPI {
  /**
   * Returns a new context with propagation fields (trace parent,
   * baggage, ...) read from the supplied carrier merged into it.
   */
  extract(
    context: TracingServiceContext,
    carrier: Record<string, string | string[] | undefined>,
  ): TracingServiceContext;
  /**
   * Returns the baggage attached to the supplied context, or
   * `undefined` when none is present.
   */
  getBaggage(context: TracingServiceContext): TracingServiceBaggage | undefined;
  /**
   * Returns the baggage attached to the currently active context, or
   * `undefined` when none is present. Equivalent to
   * `getBaggage(context.active())`.
   */
  getActiveBaggage(): TracingServiceBaggage | undefined;
}

/**
 * Opaque handle representing a tracing context. Consumers receive
 * these from {@link TracingServiceContextAPI.active} or
 * {@link TracingServicePropagationAPI.extract} and pass them back into
 * the API; the type carries no inspectable fields.
 *
 * @alpha
 */
export interface TracingServiceContext {
  readonly $$type: '@backstage/TracingServiceContext';
}

/**
 * A read-only view of propagated baggage entries.
 *
 * @alpha
 */
export interface TracingServiceBaggage {
  getAllEntries(): Array<[string, TracingServiceBaggageEntry]>;
}

/**
 * A single baggage entry.
 *
 * @alpha
 */
export interface TracingServiceBaggageEntry {
  value: string;
}
