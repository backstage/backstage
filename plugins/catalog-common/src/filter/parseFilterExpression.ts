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

import { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { EntityMatcherFn } from './matrchers/types';
import { createKindMatcher } from './matrchers/createKindMatcher';
import { createTypeMatcher } from './matrchers/createTypeMatcher';
import { createIsMatcher } from './matrchers/createIsMatcher';
import { createHasMatcher } from './matrchers/createHasMatcher';

const rootMatcherFactories: Record<
  string,
  (
    parameters: string[],
    onParseError: (error: Error) => void,
  ) => EntityMatcherFn
> = {
  kind: createKindMatcher,
  type: createTypeMatcher,
  is: createIsMatcher,
  has: createHasMatcher,
};

/**
 * Parses a filter expression that decides whether to render an entity component
 * or not. Returns a function that matches entities based on that expression.
 *
 * @alpha
 * @remarks
 *
 * Filter strings are on the form `kind:user,group is:orphan`. There's
 * effectively an AND between the space separated parts, and an OR between comma
 * separated parameters. So the example filter string semantically means
 * "entities that are of either User or Group kind, and also are orphans".
 *
 * The `onParseError` callback is called whenever an error was encountered
 * during initial parsing of the expression. If the callback throws,
 * `parseFilterExpression` throws that same error. If the callback does not
 * throw, the part of the input expression that had an error is ignored entirely
 * and parsing continues.
 *
 * The `onEvaluateError` callback is called whenever an error was encountered
 * during evaluation of the returned function. If the callback throws, the
 * evaluation call throws the same error. If the callback does not throw, the
 * whole evaluation returns false.
 */
export function parseFilterExpression(
  expression: string,
  options?: {
    onParseError?: (
      error: Error,
      context: {
        expression: string;
      },
    ) => void;
    onEvaluateError?: (
      error: Error,
      context: {
        expression: string;
        entity: Entity;
      },
    ) => void;
  },
): (entity: Entity) => boolean {
  const parts = splitFilterExpression(expression, e =>
    options?.onParseError?.(e, { expression }),
  );

  const matchers = parts.map(part => {
    const factory = rootMatcherFactories[part.key];
    if (!factory) {
      const known = Object.keys(rootMatcherFactories).map(m => `'${m}'`);
      throw new InputError(
        `'${part.key}' is not a valid filter expression key, expected one of ${known}`,
      );
    }
    return factory(part.parameters, e =>
      options?.onParseError?.(e, { expression }),
    );
  });

  return (entity: Entity) => {
    return matchers.every(matcher => {
      try {
        return matcher(entity);
      } catch (e) {
        options?.onEvaluateError?.(e, { expression, entity });
        return false;
      }
    });
  };
}

export function splitFilterExpression(
  expression: string,
  onParseError: (error: Error) => void,
): Array<{ key: string; parameters: string[] }> {
  const words = expression
    .split(' ')
    .map(w => w.trim())
    .filter(Boolean);

  const result = new Array<{ key: string; parameters: string[] }>();

  for (const word of words) {
    const match = word.match(/^([^:]+):(.+)$/);
    if (!match) {
      onParseError(
        new InputError(
          `'${word}' is not a valid filter expression, expected 'key:parameter' form`,
        ),
      );
      continue;
    }

    const key = match[1];
    const parameters = match[2].split(',').filter(Boolean); // silently ignore double commas

    result.push({ key, parameters });
  }

  return result;
}
