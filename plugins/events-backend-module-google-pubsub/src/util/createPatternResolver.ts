/*
 * Copyright 2025 The Backstage Authors
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
import { getJsonValueAtPath } from '@backstage/filter-predicates';

/**
 * Takes a pattern string that may contain `{{ path.to.value }}` placeholders,
 * and returns a function that accepts an input object and returns strings that
 * have had its placeholders filled in by following the dot separated path of
 * properties accordingly on the input.
 *
 * @internal
 */
export function createPatternResolver(
  pattern: string,
): (input: JsonObject) => string {
  // This split results in an array where even elements are static strings
  // between placeholders, and odd elements are the contents inside
  // placeholders.
  //
  // For example, the pattern:
  //   "{{ foo }}-{{bar}}{{baz}}."
  // will result in:
  //   ['', 'foo', '-', 'bar', '', 'baz', '.']
  const patternParts = pattern.split(/{{\s*([\w\[\]'"_.-]*)\s*}}/g);

  const resolvers = new Array<(input: JsonObject) => string>();

  for (let i = 0; i < patternParts.length; i += 2) {
    const staticPart = patternParts[i];
    const placeholderPart = patternParts[i + 1];

    if (staticPart) {
      resolvers.push(() => staticPart);
    }

    if (placeholderPart) {
      const getter = createGetter(placeholderPart);
      resolvers.push(input => {
        const value = getter(input);
        if (typeof value === 'string' || Number.isFinite(value)) {
          return String(value);
        } else if (!value) {
          throw new InputError(`No value for selector '${placeholderPart}'`);
        } else {
          throw new InputError(
            `Expected string or number value for selector '${placeholderPart}', got ${typeof value}`,
          );
        }
      });
    }
  }

  return input => resolvers.map(resolver => resolver(input)).join('');
}

/**
 * Takes a path string that indexes into an object, and returns a function that
 * fetches values out of such objects.
 *
 * @internal
 */
export function createGetter(
  path: string,
): (input: JsonObject) => JsonValue | undefined {
  // The result of the split contains pairs (with maybe no last element):
  //
  // - any "regular" dot separated parts, if applicable
  // - any "exact" match parts within square brackets, if applicable
  //
  // For example, the path:
  //   foo.bar[0].baz["qux.e"]a
  //
  // will result in:
  //   [
  //     'foo.bar', '0',
  //     'baz', 'qux.e',
  //     'a',
  //   ]
  const parts = path
    .split(/\[(?:(\d+)|'([^']+)'|"([^"]+)")\]\.?/g)
    .filter(Boolean);

  return input => {
    let current: JsonValue | undefined = input;
    for (let i = 0; i < parts.length; i += 2) {
      const regularPart = parts[i];
      const exactPart = parts[i + 1];

      if (regularPart) {
        current = getJsonValueAtPath(current, regularPart);
      }

      if (exactPart) {
        if (typeof current !== 'object' || !current) {
          return undefined;
        } else if (Array.isArray(current)) {
          if (exactPart.match(/^\d+$/)) {
            current = current[Number(exactPart)];
          } else {
            return undefined;
          }
        } else {
          if (!Object.hasOwn(current, exactPart)) {
            return undefined;
          }
          current = current[exactPart];
        }
      }
    }

    return current;
  };
}
