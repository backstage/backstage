/*
 * Copyright 2020 The Backstage Authors
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

import { JsonValue } from '@backstage/types';
import { TransformFunc } from './types';
import { SubstitutionFunc } from '../types';

/**
 * A environment variable substitution transform that transforms e.g. 'token ${MY_TOKEN}'
 * to 'token abc' if MY_TOKEN is 'abc'. If any of the substituted variables are undefined,
 * the entire expression ends up undefined. Additionally, supports parameter substitution
 * syntax to provide a default or fallback value for a given environment variable if it is
 * unset; e.g. 'token ${MY_TOKEN:-xyz}' transforms to 'token xyz' if MY_TOKEN is unset.
 */
export function createSubstitutionTransform(
  env: SubstitutionFunc,
): TransformFunc {
  return async (input: JsonValue) => {
    if (typeof input !== 'string') {
      return { applied: false };
    }

    const parts: (string | undefined)[] = input.split(/(\$?\$\{[^{}]*\})/);
    for (let i = 1; i < parts.length; i += 2) {
      const part = parts[i]!;
      if (part.startsWith('$$')) {
        parts[i] = part.slice(1);
      } else {
        const indexOfFallbackSeparator = part.indexOf(':-');

        if (indexOfFallbackSeparator > -1) {
          const envVarValue = await env(
            part.slice(2, indexOfFallbackSeparator).trim(),
          );
          const fallbackValue = part
            .slice(indexOfFallbackSeparator + ':-'.length, -1)
            .trim();

          parts[i] = envVarValue || fallbackValue || undefined;
        } else {
          parts[i] = await env(part.slice(2, -1).trim());
        }
      }
    }

    if (parts.some(part => part === undefined)) {
      return { applied: true, value: undefined };
    }
    return { applied: true, value: parts.join('') };
  };
}
