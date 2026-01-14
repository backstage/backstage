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
import { JsonPrimitive } from '@backstage/types';

/**
 * Takes a pattern string that may contain `{{ path.to.value }}` placeholders,
 * and returns a function that accepts a context object and returns strings that
 * have had its placeholders filled in by following the dot separated path of
 * properties accordingly on the context.
 *
 * @public
 */
export function createPatternResolver<TContext extends object = object>(
  pattern: string,
): (context: TContext) => JsonPrimitive {
  // This split results in an array where even elements are static strings
  // between placeholders, and odd elements are the contents inside
  // placeholders.
  //
  // For example, the pattern:
  //   "{{ foo }}-{{bar}}{{baz}}."
  // will result in:
  //   ['', 'foo', '-', 'bar', '', 'baz', '.']
  const patternParts = pattern.split(/{{\s*([\w\[\]'"_.-]*)\s*}}/g);

  const resolvers = new Array<(context: TContext) => JsonPrimitive>();

  for (let i = 0; i < patternParts.length; i += 2) {
    const staticPart = patternParts[i];
    const placeholderPart = patternParts[i + 1];

    if (staticPart) {
      resolvers.push(() => staticPart);
    }

    if (placeholderPart) {
      const getter = createGetter<TContext>(placeholderPart);
      resolvers.push(context => {
        const value = getter(context);
        if (
          typeof value === 'string' ||
          typeof value === 'boolean' ||
          Number.isFinite(value)
        ) {
          return value as JsonPrimitive;
        } else if (!value) {
          throw new InputError(`No value for selector '${placeholderPart}'`);
        } else {
          throw new InputError(
            `Expected primitive value for selector '${placeholderPart}', got ${typeof value}`,
          );
        }
      });
    }
  }

  return context => {
    if (resolvers.length === 1) {
      // Return simple values without the string cast.
      return resolvers[0](context) as JsonPrimitive;
    }
    // Otherwise, cast to string and join.
    return resolvers.map(resolver => String(resolver(context))).join('');
  };
}

function createGetter<TContext extends object = object>(
  path: string,
): (context: TContext) => unknown | undefined {
  // The result of the split contains quads:
  //
  // - any "regular" part
  // - pure digits that were within brackets, if applicable
  // - contents of a single quoted string that was within brackets, if applicable
  // - contents of a double quoted string that was within brackets, if applicable
  //
  // For example, the path:
  //   foo.bar[0].baz["qux.e"]a
  // will result in:
  //   [
  //     'foo', undefined, undefined, undefined,
  //     'bar', '0',       undefined, undefined,
  //     'baz', undefined, 'qux.e',   undefined,
  //     'a'
  //   ]
  // and then the empty elements are stripped away
  const parts = path
    .split(/\.|\[(?:(\d+)|'([^']+)'|"([^"]+)")\]\.?/g)
    .filter(Boolean);

  return (context: TContext): unknown | undefined => {
    let current = context;
    for (const part of parts) {
      if (typeof current !== 'object' || !current) {
        return undefined;
      }

      if (Array.isArray(current)) {
        if (!part.match(/^\d+$/)) {
          return undefined;
        }
        current = (current as any[])[Number(part)];
      } else {
        if (!Object.hasOwn(current, part)) {
          return undefined;
        }
        current = (current as any)[part];
      }
    }

    return current;
  };
}
