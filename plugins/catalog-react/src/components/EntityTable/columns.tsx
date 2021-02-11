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

import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { TableColumn } from '@backstage/core';
import React from 'react';
import { getEntityRelations } from '../../utils';
import {
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
} from '../EntityRefLink';

export function createEntityRefColumn<T extends Entity>({
  defaultKind,
}: {
  defaultKind?: string;
}): TableColumn<T> {
  function formatContent(entity: T): string {
    return formatEntityRefTitle(entity, {
      defaultKind,
    });
  }

  return {
    title: 'Name',
    highlight: true,
    customFilterAndSearch(filter, entity) {
      // TODO: We could implement this more efficiently, like searching over each field individually, but that migth confuse the user
      return formatContent(entity).includes(filter);
    },
    customSort(entity1, entity2) {
      // TODO: We could implement this more efficiently by comparing field by field.
      return formatContent(entity1).localeCompare(formatContent(entity2));
    },
    render: entity => (
      <EntityRefLink entityRef={entity} defaultKind={defaultKind} />
    ),
  };
}

export function createOwnerColumn<T extends Entity>(): TableColumn<T> {
  function formatContent(entity: T): string {
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
    return ownedByRelations
      .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
      .join(', ');
  }

  return {
    title: 'Owner',
    customFilterAndSearch(filter, entity) {
      return formatContent(entity).includes(filter);
    },
    customSort(entity1, entity2) {
      return formatContent(entity1).localeCompare(formatContent(entity2));
    },
    render: entity => {
      const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
      return (
        <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
      );
    },
  };
}

export function createDomainColumn<T extends Entity>(): TableColumn<T> {
  function formatContent(entity: T): string {
    const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'domain',
    });
    return partOfDomainRelations
      .map(r => formatEntityRefTitle(r, { defaultKind: 'domain' }))
      .join(', ');
  }

  return {
    title: 'Domain',
    customFilterAndSearch(filter, entity) {
      return formatContent(entity).includes(filter);
    },
    customSort(entity1, entity2) {
      return formatContent(entity1).localeCompare(formatContent(entity2));
    },
    render: entity => {
      const partOfDomainRelations = getEntityRelations(
        entity,
        RELATION_PART_OF,
        {
          kind: 'domain',
        },
      );
      return (
        <EntityRefLinks
          entityRefs={partOfDomainRelations}
          defaultKind="domain"
        />
      );
    },
  };
}

export function createMetadataDescriptionColumn<
  T extends Entity
>(): TableColumn<T> {
  return {
    title: 'Description',
    field: 'metadata.description',
    width: 'auto',
  };
}
