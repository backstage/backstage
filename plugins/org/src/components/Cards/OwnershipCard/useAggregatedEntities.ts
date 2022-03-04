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
  RELATION_PARENT_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import limiterFactory from 'p-limit';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import qs from 'qs';

const limiter = limiterFactory(10);

type EntityTypeProps = {
  kind: string;
  type: string;
  count: number;
};

const getQueryParams = (
  ownerEntitiesRef: string[],
  selectedEntity: EntityTypeProps,
): string => {
  const { kind, type } = selectedEntity;
  // removing 'group:default/' from the string entity ref 'group:default/team-a'
  const owners = ownerEntitiesRef.map(owner => owner.split('/')[1]);
  const filters = {
    kind,
    type,
    owners,
    user: 'all',
  };
  const queryParams = qs.stringify({
    filters,
  });

  return queryParams;
};

export function useAggregatedEntities(
  entity: Entity,
  entityFilterKind?: string[],
): {
  componentsWithCounters:
    | {
        counter: number;
        type: string;
        name: string;
        queryParams: string;
      }[]
    | undefined;
  loading: boolean;
  error?: Error;
} {
  const catalogApi = useApi(catalogApiRef);
  const requestedEntities: Entity[] = [];
  const outstandingEntities = new Map<string, Promise<Entity | undefined>>();
  const processedEntities = new Set<string>();
  requestedEntities.push(entity);
  let currentEntity = entity;
  const kinds = entityFilterKind ?? ['Component', 'API', 'System'];

  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    while (requestedEntities.length > 0) {
      const childRelations = getEntityRelations(
        currentEntity,
        RELATION_PARENT_OF,
        {
          kind: 'Group',
        },
      );

      await Promise.all(
        childRelations.map(childGroup =>
          limiter(async () => {
            const promise = catalogApi.getEntityByRef(childGroup);
            outstandingEntities.set(childGroup.name, promise);
            try {
              const processedEntity = await promise;
              if (processedEntity) {
                requestedEntities.push(processedEntity);
              }
            } finally {
              outstandingEntities.delete(childGroup.name);
            }
          }),
        ),
      );
      requestedEntities.shift();
      processedEntities.add(
        stringifyEntityRef({
          kind: currentEntity.kind,
          namespace: currentEntity.metadata.namespace,
          name: currentEntity.metadata.name,
        }),
      );
      // always set currentEntity to the first element of array requestedEntities
      currentEntity = requestedEntities[0];
    }

    const owners = Array.from(processedEntities);
    const ownedAggregationEntitiesList = await catalogApi.getEntities({
      filter: [
        {
          kind: kinds,
          'relations.ownedBy': owners,
        },
      ],
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'relations',
      ],
    });

    const counts = ownedAggregationEntitiesList.items.reduce(
      (acc: EntityTypeProps[], ownedEntity) => {
        const match = acc.find(
          x =>
            x.kind === ownedEntity.kind &&
            x.type === (ownedEntity.spec?.type ?? ownedEntity.kind),
        );
        if (match) {
          match.count += 1;
        } else {
          acc.push({
            kind: ownedEntity.kind,
            type: ownedEntity.spec?.type?.toString() ?? ownedEntity.kind,
            count: 1,
          });
        }
        return acc;
      },
      [],
    );

    // Return top N (six) entities to be displayed in ownership boxes
    const topN = counts.sort((a, b) => b.count - a.count).slice(0, 6);

    return topN.map(topOwnedEntity => ({
      counter: topOwnedEntity.count,
      type: topOwnedEntity.type,
      name: topOwnedEntity.type.toLocaleUpperCase('en-US'),
      queryParams: getQueryParams(owners, topOwnedEntity),
    })) as Array<{
      counter: number;
      type: string;
      name: string;
      queryParams: string;
    }>;
  }, [catalogApi, entity]);

  return {
    componentsWithCounters,
    loading,
    error,
  };
}
