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

import { Entity } from '@backstage/catalog-model';

/** @public */
export interface EntityPredicates {
  kind?: string | string[];
  type?: string | string[];
}

function strCmp(a: unknown, b: string | undefined): boolean {
  return Boolean(
    a &&
      typeof a === 'string' &&
      a?.toLocaleLowerCase('en-US') === b?.toLocaleLowerCase('en-US'),
  );
}

function strCmpAll(value: unknown, cmpValues: string | string[]) {
  return typeof cmpValues === 'string'
    ? strCmp(value, cmpValues)
    : cmpValues.length === 0 || cmpValues.some(cmpVal => strCmp(value, cmpVal));
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is of a given kind.
 * @public
 */
export function isKind(kinds: string | string[]) {
  return isEntityWith({ kind: kinds });
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is a Component of a given spec.type.
 * @public
 */
export function isComponentType(types: string | string[]) {
  return isEntityWith({ kind: 'component', type: types });
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is a Resource of a given spec.type.
 * @public
 */
export function isResourceType(types: string | string[]) {
  return isEntityWith({ kind: 'resource', type: types });
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is an API of a given spec.type.
 * @public
 */
export function isApiType(types: string | string[]) {
  return isEntityWith({ kind: 'api', type: types });
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is the specified kind and type (if present).
 * @public
 */
export function isEntityWith(predicate: EntityPredicates) {
  return (entity: Entity) => {
    if (predicate.kind && !strCmpAll(entity.kind, predicate.kind)) {
      return false;
    }

    if (predicate.type && !strCmpAll(entity.spec?.type, predicate.type)) {
      return false;
    }

    // there's no type check, return true
    return true;
  };
}

/**
 * For use in EntitySwitch.Case. Matches if the entity is in a given namespace.
 * @public
 */
export function isNamespace(namespaces: string | string[]) {
  return (entity: Entity) => strCmpAll(entity.metadata?.namespace, namespaces);
}
