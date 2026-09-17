/*
 * Copyright 2021 The Backstage Authors
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

import { Config, readDurationFromConfig } from '@backstage/config';
import { HumanDuration, JsonObject, JsonValue } from '@backstage/types';

import { isArray } from 'lodash';
import { Schema } from 'jsonschema';

/**
 * Returns true if the input is not `false`, `undefined`, `null`, `""`, `0`, or
 * `[]`. This behavior is based on the behavior of handlebars, see
 * https://handlebarsjs.com/guide/builtin-helpers.html#if
 */
export function isTruthy(value: any): boolean {
  return isArray(value) ? value.length > 0 : !!value;
}

function isPlainObject(item: JsonValue): item is JsonObject {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

/**
 * Filters an output array by evaluating the `if` condition on each item,
 * and strips the `if` field from items that pass. Non-plain-object items
 * are passed through unchanged.
 */
export function filterConditionalItems<T>(items: readonly T[]): T[] {
  return items.flatMap(item => {
    if (!isPlainObject(item as JsonValue)) return [item];
    const obj = item as JsonObject;
    if ('if' in obj && !isTruthy(obj.if)) return [];
    const { if: _if, ...rest } = obj;
    return [rest as T];
  });
}

export function generateExampleOutput(schema: Schema): unknown {
  const { examples } = schema as { examples?: unknown };
  if (examples && Array.isArray(examples)) {
    return examples[0];
  }
  if (schema.type === 'object') {
    return Object.fromEntries(
      Object.entries(schema.properties ?? {}).map(([key, value]) => [
        key,
        generateExampleOutput(value as Schema),
      ]),
    );
  } else if (schema.type === 'array') {
    const [firstSchema] = [schema.items]?.flat();
    if (firstSchema) {
      return [generateExampleOutput(firstSchema as Schema)];
    }
    return [];
  } else if (schema.type === 'string') {
    return '<example>';
  } else if (schema.type === 'number') {
    return 0;
  } else if (schema.type === 'boolean') {
    return false;
  }
  return '<unknown>';
}

export const readDuration = (
  config: Config | undefined,
  key: string,
  defaultValue: HumanDuration,
) => {
  if (config?.has(key)) {
    return readDurationFromConfig(config, { key });
  }
  return defaultValue;
};
