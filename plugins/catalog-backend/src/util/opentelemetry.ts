/*
 * Copyright 2023 The Backstage Authors
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

import { Span, SpanOptions, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { parseEntityRef } from '@backstage/catalog-model';

export const TRACER_ID = 'backstage-plugin-catalog-backend';

export function addEntityAttributes(span: Span, entityRef: string) {
  try {
    const fields = parseEntityRef(entityRef);
    span.setAttribute('backstage.entity.kind', fields.kind);
    span.setAttribute('backstage.entity.namespace', fields.namespace);
    span.setAttribute('backstage.entity.name', fields.name);
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR });
  }
}

// Adapted from https://github.com/open-telemetry/opentelemetry-js/blob/359fbcc40a859057a02b14e84599eac399b8dba7/api/src/trace/SugaredTracer.ts
// While waiting for something like https://github.com/open-telemetry/opentelemetry-js/pull/3317 to land upstream

const onException = (e: Error, span: Span) => {
  span.recordException(e);
  span.setStatus({
    code: SpanStatusCode.ERROR,
  });
};

function handleFn<F extends (span: Span) => ReturnType<F>>(
  span: Span,
  fn: F,
): ReturnType<F> {
  try {
    const ret = fn(span) as Promise<ReturnType<F>>;
    // if fn is an async function attach a recordException and spanEnd callback to the promise
    if (typeof ret.then === 'function' && typeof ret.catch === 'function') {
      return ret
        .catch((e: Error) => {
          onException(e, span);
          throw e;
        })
        .finally(() => span.end()) as ReturnType<F>;
    }
    span.end();
    return ret as ReturnType<F>;
  } catch (e) {
    onException(e, span);
    span.end();
    throw e;
  }
}

export function withActiveSpan<F extends (span: Span) => ReturnType<F>>(
  tracer: Tracer,
  name: string,
  fn: F,
  spanOptions: SpanOptions = {},
): ReturnType<F> {
  return tracer.startActiveSpan(name, spanOptions, (span: Span) => {
    return handleFn(span, fn);
  });
}
