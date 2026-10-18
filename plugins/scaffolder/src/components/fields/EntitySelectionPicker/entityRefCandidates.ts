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

type CandidateOptions = {
  catalogFilter?: EntityFilterQuery;
  defaultKind?: string;
  defaultNamespace?: string;
};

function filterList(catalogFilter?: EntityFilterQuery) {
  return catalogFilter ? [catalogFilter].flat() : [{}];
}

/**
 * Valid entity references that the input could mean, using the filter only to
 * infer which kinds a bare name may have.
 */
export function parseEntityRefCandidates(
  input: string,
  options: CandidateOptions,
): string[] {
  const text = input.trim();
  if (!text) return [];
  const kindSets = filterList(options.catalogFilter).map(filter => {
    const value = Object.entries(filter).find(
      ([key]) => key.toLocaleLowerCase('en-US') === 'kind',
    )?.[1];
    const values = [value ?? []].flat();
    // Only a list of plain strings is a finite set; an existence sentinel is not.
    return value !== undefined &&
      values.every((kind): kind is string => typeof kind === 'string')
      ? values
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
          return [stringifyEntityRef(ref)];
        } catch {
          return [];
        }
      }),
    ),
  );
}

/**
 * Whether a reference satisfies the kind, namespace, and name constraints of a
 * filter. Other fields cannot be evaluated without the entity itself.
 */
export function matchesFilterIdentity(
  ref: string,
  catalogFilter?: EntityFilterQuery,
): boolean {
  const { kind, namespace, name } = parseEntityRef(ref);
  const identity: Record<string, string> = {
    kind,
    'metadata.namespace': namespace,
    'metadata.name': name,
  };
  return filterList(catalogFilter).some(filter =>
    Object.entries(filter).every(([key, value]) => {
      const actual = identity[key.toLocaleLowerCase('en-US')];
      if (!actual) return true;
      const values = [value].flat();
      // Like the catalog, an existence sentinel anywhere in the list matches.
      if (values.some(expected => typeof expected === 'symbol')) return true;
      return values.some(
        expected =>
          typeof expected === 'string' &&
          expected.toLocaleLowerCase('en-US') ===
            actual.toLocaleLowerCase('en-US'),
      );
    }),
  );
}

/** References that the input could mean and that the filter could accept. */
export function entityRefCandidates(
  input: string,
  options: CandidateOptions,
): string[] {
  return parseEntityRefCandidates(input, options).filter(ref =>
    matchesFilterIdentity(ref, options.catalogFilter),
  );
}
