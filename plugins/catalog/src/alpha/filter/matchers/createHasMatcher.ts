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

import { InputError } from '@backstage/errors';
import { EntityMatcherFn } from './types';

const allowedMatchers: Record<string, EntityMatcherFn> = {
  labels: entity => {
    return Object.keys(entity.metadata.labels ?? {}).length > 0;
  },
  links: entity => {
    return (entity.metadata.links ?? []).length > 0;
  },
};

/**
 * Matches on the non-empty presence of different parts of the entity
 */
export function createHasMatcher(
  parameters: string[],
  onParseError: (error: Error) => void,
): EntityMatcherFn {
  const matchers = parameters.flatMap(parameter => {
    const matcher = allowedMatchers[parameter.toLocaleLowerCase('en-US')];
    if (!matcher) {
      const known = Object.keys(allowedMatchers).map(m => `'${m}'`);
      onParseError(
        new InputError(
          `'${parameter}' is not a valid parameter for 'has' filter expressions, expected one of ${known}`,
        ),
      );
      return [];
    }
    return [matcher];
  });

  return entity =>
    matchers.length ? matchers.some(matcher => matcher(entity)) : true;
}
