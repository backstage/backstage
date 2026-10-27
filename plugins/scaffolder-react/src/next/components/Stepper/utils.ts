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
import type { JsonObject, JsonValue } from '@backstage/types';
import type { FieldValidation } from '@rjsf/utils';
import { FormValidation } from './createAsyncValidators';
import type { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

function isFieldValidation(error: any): error is FieldValidation {
  return !!error && '__errors' in error;
}

export function hasErrors(errors?: FormValidation): boolean {
  if (!errors) {
    return false;
  }

  for (const error of Object.values(errors)) {
    if (isFieldValidation(error)) {
      if ((error.__errors ?? []).length > 0) {
        return true;
      }

      continue;
    }

    if (hasErrors(error)) {
      return true;
    }
  }

  return false;
}

export function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Inspect declarations rather than resolving a schema against retained form data.
// All conditional branches count as ownership, including inactive hidden branches.
function declaresPath(
  schema: JsonValue | undefined,
  path: string[],
  root: JsonObject,
  visited = new Set<JsonObject>(),
): boolean {
  if (!isObject(schema) || visited.has(schema)) {
    return false;
  }
  visited.add(schema);
  const [key, ...rest] = path;
  const ownsChild = (child: JsonValue | undefined) =>
    child !== undefined &&
    (rest.length === 0 || declaresPath(child, rest, root));

  if (
    isObject(schema.properties) &&
    Object.prototype.hasOwnProperty.call(schema.properties, key) &&
    ownsChild(schema.properties[key])
  ) {
    return true;
  }
  if (/^(0|[1-9]\d*)$/.test(key)) {
    const item = Array.isArray(schema.items)
      ? schema.items[Number(key)] ?? schema.additionalItems
      : schema.items;
    if (ownsChild(item)) {
      return true;
    }
  }
  if (isObject(schema.patternProperties)) {
    for (const [pattern, child] of Object.entries(schema.patternProperties)) {
      if (new RegExp(pattern).test(key) && ownsChild(child)) {
        return true;
      }
    }
  }
  if (
    isObject(schema.additionalProperties) &&
    ownsChild(schema.additionalProperties)
  ) {
    return true;
  }

  const reference = schema.$ref;
  if (
    typeof reference === 'string' &&
    (reference === '#' || reference.startsWith('#/'))
  ) {
    let target: JsonValue | undefined = root;
    const segments = reference === '#' ? [] : reference.slice(2).split('/');
    for (const segment of segments) {
      const name = decodeURIComponent(segment)
        .replace(/~1/g, '/')
        .replace(/~0/g, '~');
      if (Array.isArray(target)) {
        target = target[Number(name)];
      } else {
        target = isObject(target) ? target[name] : undefined;
      }
    }
    if (declaresPath(target, path, root, visited)) {
      return true;
    }
  }

  for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
    const branches = schema[keyword];
    if (
      Array.isArray(branches) &&
      branches.some(branch => declaresPath(branch, path, root, visited))
    ) {
      return true;
    }
  }
  for (const keyword of ['then', 'else']) {
    if (declaresPath(schema[keyword], path, root, visited)) {
      return true;
    }
  }
  for (const keyword of ['dependencies', 'dependentSchemas']) {
    const dependencies = schema[keyword];
    if (
      isObject(dependencies) &&
      Object.values(dependencies).some(branch =>
        declaresPath(branch, path, root, visited),
      )
    ) {
      return true;
    }
  }
  return false;
}

export function filterReviewState(
  formState: JsonObject,
  visibleSteps: ParsedTemplateSchema[],
  hiddenSteps: ParsedTemplateSchema[],
): JsonObject {
  if (!hiddenSteps.length) {
    return formState;
  }
  const ownsPath = (steps: ParsedTemplateSchema[], path: string[]) =>
    steps.some(({ mergedSchema }) =>
      declaresPath(mergedSchema, path, mergedSchema),
    );

  function filterValue(
    value: JsonValue | undefined,
    path: string[],
  ): JsonValue | undefined {
    if (!ownsPath(visibleSteps, path) && ownsPath(hiddenSteps, path)) {
      return undefined;
    }
    if (Array.isArray(value)) {
      // Keep array positions intact when an item is omitted from review.
      return value.map(
        (item, index) => filterValue(item, [...path, String(index)]) ?? null,
      );
    }
    return isObject(value) ? filterObject(value, path) : value;
  }

  function filterObject(value: JsonObject, parent: string[] = []): JsonObject {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        const filtered = filterValue(entry, [...parent, key]);
        return filtered === undefined ? [] : [[key, filtered]];
      }),
    );
  }
  return filterObject(formState);
}
