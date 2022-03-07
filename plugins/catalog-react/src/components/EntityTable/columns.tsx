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

import {
  Entity,
  CompoundEntityRef,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { OverflowTooltip, TableColumn } from '@backstage/core-components';
import React from 'react';
import { getEntityRelations } from '../../utils';
import {
  EntityRefLink,
  EntityRefLinks,
  humanizeEntityRef,
} from '../EntityRefLink';

/** @public */
export const columnFactories = Object.freeze({
  createEntityRefColumn<T extends Entity>(options: {
    defaultKind?: string;
  }): TableColumn<T> {
    const { defaultKind } = options;
    function formatContent(entity: T): string {
      return (
        entity.metadata?.title ||
        humanizeEntityRef(entity, {
          defaultKind,
        })
      );
    }

    return {
      title: 'Name',
      highlight: true,
      customFilterAndSearch(filter, entity) {
        // TODO: We could implement this more efficiently, like searching over
        // each field that is displayed individually (kind, namespace, name).
        // but that might confuse the user as it will behave different than a
        // simple text search.
        // Another alternative would be to cache the values. But writing them
        // into the entity feels bad too.
        return formatContent(entity).includes(filter);
      },
      customSort(entity1, entity2) {
        // TODO: We could implement this more efficiently by comparing field by field.
        // This has similar issues as above.
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: entity => (
        <EntityRefLink
          entityRef={entity}
          defaultKind={defaultKind}
          title={entity.metadata?.title}
        />
      ),
    };
  },
  createEntityRelationColumn<T extends Entity>({
    title,
    relation,
    defaultKind,
    filter: entityFilter,
  }: {
    title: string;
    relation: string;
    defaultKind?: string;
    filter?: { kind: string };
  }): TableColumn<T> {
    function getRelations(entity: T): CompoundEntityRef[] {
      return getEntityRelations(entity, relation, entityFilter);
    }

    function formatContent(entity: T): string {
      return getRelations(entity)
        .map(r => humanizeEntityRef(r, { defaultKind }))
        .join(', ');
    }

    return {
      title,
      customFilterAndSearch(filter, entity) {
        return formatContent(entity).includes(filter);
      },
      customSort(entity1, entity2) {
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: entity => {
        return (
          <EntityRefLinks
            entityRefs={getRelations(entity)}
            defaultKind={defaultKind}
          />
        );
      },
    };
  },
  createOwnerColumn<T extends Entity>(): TableColumn<T> {
    return this.createEntityRelationColumn({
      title: 'Owner',
      relation: RELATION_OWNED_BY,
      defaultKind: 'group',
    });
  },
  createDomainColumn<T extends Entity>(): TableColumn<T> {
    return this.createEntityRelationColumn({
      title: 'Domain',
      relation: RELATION_PART_OF,
      defaultKind: 'domain',
      filter: {
        kind: 'domain',
      },
    });
  },
  createSystemColumn<T extends Entity>(): TableColumn<T> {
    return this.createEntityRelationColumn({
      title: 'System',
      relation: RELATION_PART_OF,
      defaultKind: 'system',
      filter: {
        kind: 'system',
      },
    });
  },
  createMetadataDescriptionColumn<T extends Entity>(): TableColumn<T> {
    return {
      title: 'Description',
      field: 'metadata.description',
      render: entity => (
        <OverflowTooltip
          text={entity.metadata.description}
          placement="bottom-start"
          line={2}
        />
      ),
      width: 'auto',
    };
  },
  createSpecLifecycleColumn<T extends Entity>(): TableColumn<T> {
    return {
      title: 'Lifecycle',
      field: 'spec.lifecycle',
    };
  },
  createSpecTypeColumn<T extends Entity>(): TableColumn<T> {
    return {
      title: 'Type',
      field: 'spec.type',
    };
  },
});
