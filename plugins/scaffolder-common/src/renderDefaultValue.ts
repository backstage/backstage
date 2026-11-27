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
import { parseEntityRef } from '@backstage/catalog-model';
import { JsonObject, JsonValue } from '@backstage/types';
import {
  createTemplateRenderer,
  type TemplateContext,
  type TemplateValue,
} from 'nunjitsu';

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function parseEntityRefFilter(
  input: TemplateValue | undefined,
  context?: TemplateValue | undefined,
): TemplateValue | undefined {
  if (
    typeof input !== 'string' &&
    (typeof input !== 'object' || input === null || Array.isArray(input))
  ) {
    throw new TypeError(
      'parseEntityRef requires an entity reference string or object',
    );
  }

  const parsed = parseEntityRef(
    input as string | { kind?: string; namespace?: string; name: string },
    context && typeof context === 'object' && !Array.isArray(context)
      ? (context as { defaultKind?: string; defaultNamespace?: string })
      : undefined,
  );

  return {
    kind: parsed.kind,
    namespace: parsed.namespace,
    name: parsed.name,
  };
}

function pickFilter(
  input: TemplateValue | undefined,
  path?: TemplateValue | undefined,
): TemplateValue | undefined {
  if (input === null || input === undefined || typeof input !== 'object') {
    return undefined;
  }
  if (typeof path !== 'string' || !path) {
    return undefined;
  }

  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let current: unknown = input;
  for (const segment of segments) {
    if (
      FORBIDDEN_KEYS.has(segment) ||
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
    } else if (Object.hasOwn(current, segment)) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current as TemplateValue | undefined;
}

const defaultValueRenderer = createTemplateRenderer({
  filters: {
    parseEntityRef: parseEntityRefFilter,
    pick: pickFilter,
  },
});

function toJsonValue(value: TemplateValue | undefined): JsonValue | undefined {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (Array.isArray(value)) {
    return value.map(item => toJsonValue(item) ?? null);
  }
  if (value instanceof Map || value instanceof Set) {
    return undefined;
  }
  if (typeof value === 'object') {
    const result: JsonObject = {};
    for (const [key, entry] of Object.entries(value)) {
      const converted = toJsonValue(entry);
      if (converted !== undefined) {
        result[key] = converted;
      }
    }
    return result;
  }
  return undefined;
}

/**
 * Renders a parameter field's `ui:backstage.default` expression against the
 * current form state using Nunjitsu.
 *
 * Supports Nunjitsu's built-in filters as well as `parseEntityRef` and `pick`.
 * Backend-only filters that depend on server configuration (such as
 * `parseRepoUrl` and `projectSlug`) and custom backend templating extensions
 * are not available.
 *
 * Returns `undefined` if the expression is empty, evaluates to `undefined`, or
 * fails to parse or evaluate.
 *
 * @alpha
 */
export function renderDefaultValue(
  expression: string | undefined,
  formState: Record<string, JsonValue>,
): JsonValue | undefined {
  if (typeof expression !== 'string' || !expression.trim()) {
    return undefined;
  }

  try {
    const result = defaultValueRenderer.renderValue(expression, {
      // Nunjitsu validates and copies optional JSON properties at runtime.
      parameters: formState as TemplateContext,
    });
    return toJsonValue(result);
  } catch {
    return undefined;
  }
}
