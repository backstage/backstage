/*
 * Copyright 2020 Spotify AB
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
import { isOwnerOf, isStarredEntity } from '@backstage/plugin-catalog-react';
import { EntityFilter, EntityFieldFilter } from './types';
import { get } from 'lodash';

type StateProps = {
  starredEntities: string[];
  ownUser: Entity | undefined;
};

export function entityPredicate(filters: EntityFilter[], state: StateProps) {
  const predicates = filters.map(f => entityFilterBy(f, state));

  return (entity: Entity) => {
    for (const predicate of predicates) {
      if (predicate && !predicate(entity)) {
        return false;
      }
    }

    return true;
  };
}

export function entityFilterBy(
  filter: EntityFilter,
  { starredEntities, ownUser }: StateProps,
) {
  switch (filter.type) {
    case 'field':
      return entityFieldFilter(filter);
    case 'owned':
      return (entity: Entity) => (ownUser ? isOwnerOf(ownUser, entity) : true);
    case 'starred':
      return (entity: Entity) =>
        isStarredEntity(new Set(starredEntities), entity);
    default:
      return assertFilterType(filter);
  }
}

function entityFieldFilter(filter: EntityFieldFilter) {
  return (entity: Entity) => {
    const { field = '', values = [] } = filter;
    const fieldValue = get(entity, field);

    if (Array.isArray(fieldValue)) {
      return values.some(r => fieldValue.includes(r));
    }

    return values.includes(fieldValue);
  };
}

// Given all entites, find all possible tags and provide them in a sorted list.
export function collectTags(entities?: Entity[]): string[] {
  const tags = (entities ?? []).flatMap(e => e.metadata.tags ?? []);
  return [...new Set(tags)].sort();
}

function assertFilterType(x: never): never {
  throw new Error(`Unexpected filter type: ${x}. Should have been never.`);
}
