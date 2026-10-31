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
import { Knex } from 'knex';

/**
 * One entry of a change scope. Only parts of the entity ref can be scoped on,
 * because an entity can't leave or enter such a scope without becoming a
 * different ref.
 */
export type EntityChangeScopeEntry = {
  kind: string;
  namespace?: string;
  name?: string;
};

/**
 * Parses scope entries on the form `kind`, `kind:namespace` or
 * `kind:namespace/name`. Entity refs are stored in lowercase, so the parts are
 * lowercased too. Duplicates are removed and the result is sorted, so that
 * equal scopes compare equal.
 */
export function parseEntityChangeScope(
  values: string[] | undefined,
): EntityChangeScopeEntry[] | undefined {
  if (!values?.length) {
    return undefined;
  }

  const unique = new Set<string>();
  for (const value of values) {
    unique.add(stringifyScopeEntry(parseScopeEntry(value)));
  }

  return [...unique].sort().map(parseScopeEntry);
}

/**
 * Formats scope entries back into their string form.
 */
export function stringifyEntityChangeScope(
  scope: EntityChangeScopeEntry[] | undefined,
): string[] | undefined {
  return scope?.map(stringifyScopeEntry);
}

/**
 * Restricts a query on final_entities to rows within the scope.
 */
export function applyEntityChangeScope(
  query: Knex.QueryBuilder,
  scope: EntityChangeScopeEntry[] | undefined,
): Knex.QueryBuilder {
  if (!scope?.length) {
    return query;
  }

  const exact = scope
    .filter(e => e.name !== undefined)
    .map(stringifyScopeEntry);
  const prefixes = scope
    .filter(e => e.name === undefined)
    .map(e => `${stringifyScopeEntry(e)}${e.namespace ? '/' : ':'}`);

  return query.where(inner => {
    if (exact.length) {
      inner.orWhereIn('final_entities.entity_ref', exact);
    }
    for (const prefix of prefixes) {
      // A plain comparison, unlike LIKE, has no wildcards to escape.
      inner.orWhereRaw('substr(final_entities.entity_ref, 1, ?) = ?', [
        prefix.length,
        prefix,
      ]);
    }
  });
}

/**
 * Whether every entry names a single ref.
 */
export function isExactEntityChangeScope(
  scope: EntityChangeScopeEntry[] | undefined,
): boolean {
  return Boolean(scope?.length) && scope!.every(e => e.name !== undefined);
}

function parseScopeEntry(value: string): EntityChangeScopeEntry {
  const match = value.trim().match(/^([^:/]+)(?::([^:/]+)(?:\/([^:/]+))?)?$/);
  if (!match) {
    throw new InputError(
      `Invalid scope "${value}", expected kind, kind:namespace or kind:namespace/name`,
    );
  }
  const [, kind, namespace, name] = match;
  return {
    kind: kind.toLowerCase(),
    ...(namespace !== undefined && { namespace: namespace.toLowerCase() }),
    ...(name !== undefined && { name: name.toLowerCase() }),
  };
}

function stringifyScopeEntry(entry: EntityChangeScopeEntry): string {
  if (entry.namespace === undefined) {
    return entry.kind;
  }
  if (entry.name === undefined) {
    return `${entry.kind}:${entry.namespace}`;
  }
  return `${entry.kind}:${entry.namespace}/${entry.name}`;
}
