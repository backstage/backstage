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
  Context,
  SpanKind,
  SpanStatusCode,
  Tracer,
  context as otelContext,
  propagation as otelPropagation,
  trace,
} from '@opentelemetry/api';
import {
  BackstageCredentials,
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import {
  TracingService,
  TracingServiceAttributes,
  TracingServiceBaggage,
  TracingServiceContext,
  TracingServiceContextAPI,
  TracingServicePropagationAPI,
  TracingServiceSpan,
  TracingServiceSpanKind,
  TracingServiceSpanOptions,
  TracingServiceSpanStatus,
} from '@backstage/backend-plugin-api/alpha';

/**
 * Options for creating a {@link DefaultTracingService}.
 *
 * @alpha
 */
export interface DefaultTracingServiceOptions {
  name: string;
  version?: string;
  schemaUrl?: string;
  pluginId: string;
  captureEndUser: boolean;
  httpAuth: HttpAuthService;
}

// `TracingServiceContext` is an opaque handle for an OTel `Context`. Internally
// the value *is* the OTel context; we just narrow the type so consumers can't
// poke at it directly.
function toOtelContext(ctx: TracingServiceContext): Context {
  return ctx as unknown as Context;
}
function fromOtelContext(ctx: Context): TracingServiceContext {
  return ctx as unknown as TracingServiceContext;
}

function wrapOtelBaggage(
  baggage: ReturnType<typeof otelPropagation.getActiveBaggage>,
): TracingServiceBaggage | undefined {
  if (!baggage) return undefined;
  return {
    getAllEntries: () =>
      baggage
        .getAllEntries()
        .map(([key, entry]) => [key, { value: entry.value }]),
  };
}

/**
 * Default implementation of the {@link TracingService} interface.
 *
 * @alpha
 */
export class DefaultTracingService implements TracingService {
  private readonly tracer: Tracer;
  private readonly pluginId: string;
  private readonly captureEndUser: boolean;
  private readonly httpAuth: HttpAuthService;

  readonly context: TracingServiceContextAPI = {
    active: () => fromOtelContext(otelContext.active()),
    // `otelContext.with` is synchronous: it activates `ctx`, invokes `fn`,
    // then restores the previous active context before this call returns.
    // When `fn` is async, the AsyncLocalStorage context manager installed
    // by the OTel SDK is what keeps `ctx` active across the callback's
    // `await`s. If no context manager is registered (e.g. in a test that
    // does not wire up the OTel SDK) the `await` continuations will run
    // outside `ctx`.
    with: async <T>(
      ctx: TracingServiceContext,
      fn: () => T | Promise<T>,
    ): Promise<T> => otelContext.with(toOtelContext(ctx), fn),
  };

  readonly propagation: TracingServicePropagationAPI = {
    extract: (
      ctx: TracingServiceContext,
      carrier: Record<string, string | string[] | undefined>,
    ): TracingServiceContext =>
      fromOtelContext(otelPropagation.extract(toOtelContext(ctx), carrier)),
    getBaggage: (ctx: TracingServiceContext) =>
      wrapOtelBaggage(otelPropagation.getBaggage(toOtelContext(ctx))),
    getActiveBaggage: () => wrapOtelBaggage(otelPropagation.getActiveBaggage()),
  };

  private constructor(opts: DefaultTracingServiceOptions) {
    this.tracer = trace
      .getTracerProvider()
      .getTracer(opts.name, opts.version, { schemaUrl: opts.schemaUrl });
    this.pluginId = opts.pluginId;
    this.captureEndUser = opts.captureEndUser;
    this.httpAuth = opts.httpAuth;
  }

  static create(opts: DefaultTracingServiceOptions): TracingService {
    return new DefaultTracingService(opts);
  }

  startActiveSpan<T>(
    name: string,
    fn: (span: TracingServiceSpan) => T | Promise<T>,
  ): Promise<T>;
  startActiveSpan<T>(
    name: string,
    options: TracingServiceSpanOptions,
    fn: (span: TracingServiceSpan) => T | Promise<T>,
  ): Promise<T>;
  async startActiveSpan<T>(
    name: string,
    optionsOrFn:
      | TracingServiceSpanOptions
      | ((span: TracingServiceSpan) => T | Promise<T>),
    maybeFn?: (span: TracingServiceSpan) => T | Promise<T>,
  ): Promise<T> {
    const [options, fn]: [
      TracingServiceSpanOptions,
      (span: TracingServiceSpan) => T | Promise<T>,
    ] =
      typeof optionsOrFn === 'function'
        ? [{}, optionsOrFn]
        : [optionsOrFn, maybeFn!];

    let credentials = options.credentials;
    if (!credentials && options.request) {
      credentials = await this.httpAuth.credentials(options.request);
    }

    const principalAttributes = this.getPrincipalAttributes(credentials);
    const attributes: TracingServiceAttributes = {
      'backstage.plugin.id': this.pluginId,
      ...options.attributes,
      ...principalAttributes,
    };

    return this.tracer.startActiveSpan(
      name,
      { kind: toSpanKind(options.kind), attributes },
      async span => {
        try {
          const wrapped: TracingServiceSpan = {
            setAttribute(key, value) {
              span.setAttribute(key, value);
            },
            setStatus(status) {
              span.setStatus({
                code: toSpanStatusCode(status.code),
                message: status.message,
              });
            },
          };
          const result = await fn(wrapped);
          span.end();
          return result;
        } catch (err) {
          const error = err as Error;
          span.recordException(error);
          span.setAttribute('error.type', error.name || 'Error');
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message || String(error),
          });
          span.end();
          throw err;
        }
      },
    );
  }

  private getPrincipalAttributes(
    credentials: BackstageCredentials | undefined,
  ): TracingServiceAttributes {
    if (!credentials) return {};
    const principal = credentials.principal as
      | { type?: string; userEntityRef?: string; subject?: string }
      | undefined;
    if (!principal?.type) return {};
    const attrs: TracingServiceAttributes = {
      'backstage.principal.type': principal.type,
    };
    if (!this.captureEndUser) return attrs;
    if (principal.type === 'user' && principal.userEntityRef) {
      attrs['enduser.id'] = principal.userEntityRef;
    } else if (principal.type === 'service' && principal.subject) {
      attrs['enduser.id'] = principal.subject;
    }
    return attrs;
  }
}

function toSpanKind(
  kind: TracingServiceSpanKind | undefined,
): SpanKind | undefined {
  switch (kind) {
    case 'internal':
      return SpanKind.INTERNAL;
    case 'server':
      return SpanKind.SERVER;
    case 'client':
      return SpanKind.CLIENT;
    case 'producer':
      return SpanKind.PRODUCER;
    case 'consumer':
      return SpanKind.CONSUMER;
    default:
      return undefined;
  }
}

function toSpanStatusCode(
  code: TracingServiceSpanStatus['code'],
): SpanStatusCode {
  switch (code) {
    case 'ok':
      return SpanStatusCode.OK;
    case 'error':
      return SpanStatusCode.ERROR;
    default:
      return SpanStatusCode.UNSET;
  }
}
