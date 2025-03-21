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
import { Entity } from '@backstage/catalog-model';

export const TRACER_ID = 'backstage-plugin-catalog-backend';

function setAttributeIfDefined(span: Span, attribute: string, value?: string) {
  if (value !== null && value !== undefined) {
    span.setAttribute(attribute, value);
  }
}

export function addEntityAttributes(span: Span, entity: Entity) {
  setAttributeIfDefined(span, 'backstage.entity.apiVersion', entity.apiVersion);
  setAttributeIfDefined(span, 'backstage.entity.kind', entity.kind);
  setAttributeIfDefined(
    span,
    'backstage.entity.metadata.namespace',
    entity.metadata?.namespace,
  );
  setAttributeIfDefined(
    span,
    'backstage.entity.metadata.name',
    entity.metadata?.name,
  );
}

// Adapted from https://github.com/open-telemetry/opentelemetry-js/blob/359fbcc40a859057a02b14e84599eac399b8dba7/api/src/trace/SugaredTracer.ts
// While waiting for something like https://github.com/open-telemetry/opentelemetry-js/pull/3317 to land upstream

const onException = (e: Error, span: Span) => {
  span.recordException(e);
  span.setStatus({
    code: SpanStatusCode.ERROR,
  });
};

function isPromiseLike<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    'then' in obj &&
    typeof obj.then === 'function'
  );
}

function handleFn<F extends (span: Span) => ReturnType<F>>(
  span: Span,
  fn: F,
): ReturnType<F> {
  try {
    const ret = fn(span);

    // if fn is an async function attach a recordException and spanEnd callback to the promise
    if (isPromiseLike(ret)) {
      ret.then(
        () => {
          span.end();
        },
        e => {
          onException(e, span);
          span.end();
        },
      );
    } else {
      span.end();
    }

    return ret;
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
