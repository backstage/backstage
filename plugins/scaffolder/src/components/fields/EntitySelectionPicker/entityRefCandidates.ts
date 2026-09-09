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

import { EntityFilterQuery } from '@backstage/catalog-client';
import {
  makeValidator,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

const validators = makeValidator();

export function entityRefCandidates(
  input: string,
  options: {
    catalogFilter?: EntityFilterQuery;
    defaultKind?: string;
    defaultNamespace?: string;
  },
): string[] {
  const text = input.trim();
  if (!text) return [];
  const filters = options.catalogFilter ? [options.catalogFilter].flat() : [{}];
  const kindSets = filters.map(filter => {
    const value = Object.entries(filter).find(
      ([key]) => key.toLocaleLowerCase('en-US') === 'kind',
    )?.[1];
    return typeof value === 'string' || Array.isArray(value)
      ? [value]
          .flat()
          .filter((kind): kind is string => typeof kind === 'string')
      : undefined;
  });
  const knownKinds = kindSets.every(kinds => kinds !== undefined)
    ? kindSets.flatMap(kinds => kinds!)
    : undefined;
  const kinds = text.includes(':')
    ? [undefined]
    : knownKinds ?? (options.defaultKind ? [options.defaultKind] : []);

  return Array.from(
    new Set(
      kinds.flatMap(defaultKind => {
        try {
          const ref = parseEntityRef(text, {
            defaultKind,
            defaultNamespace: options.defaultNamespace,
          });
          if (
            !validators.isValidKind(ref.kind) ||
            !validators.isValidNamespace(ref.namespace) ||
            !validators.isValidEntityName(ref.name)
          )
            return [];
          // Honor identity constraints, without pretending that a missing entity
          // has spec fields or relations with which to evaluate other filters.
          const identity: Record<string, string> = {
            kind: ref.kind,
            'metadata.namespace': ref.namespace,
            'metadata.name': ref.name,
          };
          if (
            !filters.some(filter =>
              Object.entries(filter).every(([key, value]) => {
                const actual = identity[key.toLocaleLowerCase('en-US')];
                if (!actual || typeof value === 'symbol') return true;
                return [value]
                  .flat()
                  .some(
                    expected =>
                      typeof expected === 'string' &&
                      expected.toLocaleLowerCase('en-US') ===
                        actual.toLocaleLowerCase('en-US'),
                  );
              }),
            )
          )
            return [];
          return [stringifyEntityRef(ref)];
        } catch {
          return [];
        }
      }),
    ),
  );
}
