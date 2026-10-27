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
import { InputError } from '@backstage/errors';
import { JsonObject, JsonValue } from '@backstage/types';

type FieldPaths = { all?: boolean; children: Map<string, FieldPaths> };

const allFields: FieldPaths = { all: true, children: new Map() };
const omitted = Symbol('omitted');

function isObject(value: unknown): value is JsonObject {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function mergePaths(target: FieldPaths, source: FieldPaths) {
  if (source.all) target.all = true;
  for (const [key, paths] of source.children) {
    const existing = target.children.get(key);
    if (existing) {
      mergePaths(existing, paths);
    } else {
      target.children.set(key, paths);
    }
  }
}

function expandSchemas(
  schema: JsonObject,
  root: JsonObject,
  ancestors = new Set<JsonObject>(),
): JsonObject[] {
  if (ancestors.has(schema)) {
    throw new InputError('Circular reference in parameter schema');
  }
  const next = new Set(ancestors).add(schema);
  const schemas = [schema];
  if (typeof schema.$ref === 'string') {
    const ref = schema.$ref;
    let target: unknown = root;
    const pointer = decodeURIComponent(ref.slice(1));
    if (!ref.startsWith('#') || (pointer && !pointer.startsWith('/'))) {
      throw new InputError(`Unsupported parameter schema reference '${ref}'`);
    }
    for (const segment of pointer ? pointer.slice(1).split('/') : []) {
      const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
      target =
        target && typeof target === 'object' && Object.hasOwn(target, key)
          ? (target as JsonObject)[key]
          : undefined;
    }
    if (!isObject(target)) {
      throw new InputError(`Missing parameter schema reference '${ref}'`);
    }
    schemas.push(...expandSchemas(target, root, next));
  }
  for (const keyword of ['allOf', 'oneOf', 'anyOf']) {
    const entries = schema[keyword];
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (isObject(entry)) schemas.push(...expandSchemas(entry, root, next));
      }
    }
  }
  for (const entry of [
    schema.then,
    schema.else,
    ...Object.values(isObject(schema.dependencies) ? schema.dependencies : {}),
  ]) {
    if (isObject(entry)) schemas.push(...expandSchemas(entry, root, next));
  }
  return schemas;
}

function collectPaths(
  schema: unknown,
  value: JsonValue | undefined,
  root: JsonObject,
  isRoot = false,
): FieldPaths {
  if (!isObject(schema) || value === undefined) return allFields;
  const paths: FieldPaths = { children: new Map() };
  for (const part of expandSchemas(schema, root)) {
    if (
      part.additionalProperties === true ||
      isObject(part.additionalProperties)
    ) {
      paths.all = true;
    }
    if (isObject(part.properties)) {
      for (const [key, property] of Object.entries(part.properties)) {
        const child = collectPaths(
          property,
          isObject(value) && Object.hasOwn(value, key) ? value[key] : undefined,
          root,
        );
        const existing = paths.children.get(key);
        if (existing) mergePaths(existing, child);
        else
          paths.children.set(key, {
            ...child,
            children: new Map(child.children),
          });
      }
    }
    if (Array.isArray(value) && part.items !== undefined) {
      for (const [index, item] of value.entries()) {
        const itemSchema = Array.isArray(part.items)
          ? part.items[index] ?? part.additionalItems
          : part.items;
        const child = collectPaths(itemSchema, item, root);
        const key = String(index);
        const existing = paths.children.get(key);
        if (existing) mergePaths(existing, child);
        else
          paths.children.set(key, {
            ...child,
            children: new Map(child.children),
          });
      }
    }
  }
  if (!isRoot && paths.children.size === 0) paths.all = true;
  return paths;
}

function filterValue(
  value: JsonValue | undefined,
  hidden: FieldPaths | undefined,
  visible: FieldPaths | undefined,
): JsonValue | undefined | typeof omitted {
  if (!hidden || visible?.all) return value;
  if (!visible) return omitted;
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const filtered = filterValue(
        item,
        hidden.all ? allFields : hidden.children.get(String(index)),
        visible.children.get(String(index)) ?? allFields,
      );
      // Keep array positions when an item is not described by the visible schema.
      return filtered === omitted || filtered === undefined ? item : filtered;
    });
  }
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        const filtered = filterValue(
          entry,
          hidden.all ? allFields : hidden.children.get(key),
          visible.children.get(key),
        );
        return filtered === omitted ? [] : [[key, filtered]];
      }),
    );
  }
  return value;
}

/**
 * Filters values owned only by hidden parameter steps without changing form data.
 *
 * Like RJSF's omission of extra data, filtering follows schema field paths,
 * including nested objects, array items, and local references. Values shared
 * with visible steps and values not described by any step are preserved.
 * References are resolved within each step's schema. Schema branches are
 * combined to include fields from previously selected options. Explicit
 * `additionalProperties` in a visible field preserves its entire value.
 *
 * @throws An {@link @backstage/errors#InputError} if a reference cannot be resolved
 * or a reference chain contains a cycle.
 *
 * @alpha
 */
export function filterHiddenStepValues(
  values: Record<string, JsonValue>,
  steps: ReadonlyArray<{ schema: JsonObject; visible: boolean }>,
): Record<string, JsonValue> {
  if (steps.every(step => step.visible)) return values;
  const hidden: FieldPaths = { children: new Map() };
  const visible: FieldPaths = { children: new Map() };
  for (const step of steps) {
    mergePaths(
      step.visible ? visible : hidden,
      collectPaths(step.schema, values, step.schema, true),
    );
  }
  return filterValue(values, hidden, visible) as Record<string, JsonValue>;
}
