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

import { DEFAULT_NAMESPACE, ANNOTATION_FORMER_NAMES } from './constants';
import { parseEntityRef, stringifyEntityRef } from './ref';
import { Entity } from './Entity';

const invalidRefPartPattern = /[:/\s]/;

/**
 * Returns the former entity refs declared in the former-names annotation of an
 * entity.
 *
 * @remarks
 *
 * The annotation value is a comma-separated list of entity refs. Short refs
 * take the kind and namespace of the entity itself, so `old-name` is read as
 * `<kind>:<namespace>/old-name`. Malformed entries, duplicates and the ref of
 * the entity itself are dropped, and the function never throws.
 *
 * @public
 * @param entity - The entity to read the annotation from
 * @returns A list of lower-cased, fully-qualified entity refs
 */
export function getEntityFormerRefs(entity: Entity): string[] {
  const value = entity.metadata?.annotations?.[ANNOTATION_FORMER_NAMES];
  if (typeof value !== 'string') {
    return [];
  }

  const defaultNamespace = entity.metadata.namespace || DEFAULT_NAMESPACE;
  const ownRef = stringifyEntityRef({
    kind: entity.kind,
    namespace: defaultNamespace,
    name: entity.metadata.name,
  });

  const result: string[] = [];
  for (const rawEntry of value.split(',')) {
    const entry = rawEntry.trim();
    if (!entry) {
      continue;
    }

    let parsed;
    try {
      parsed = parseEntityRef(entry, {
        defaultKind: entity.kind,
        defaultNamespace,
      });
    } catch {
      continue;
    }

    if (
      invalidRefPartPattern.test(parsed.kind) ||
      invalidRefPartPattern.test(parsed.namespace) ||
      invalidRefPartPattern.test(parsed.name)
    ) {
      continue;
    }

    const ref = stringifyEntityRef(parsed);
    if (ref === ownRef || result.includes(ref)) {
      continue;
    }
    result.push(ref);
  }

  return result;
}
