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

import { Entity, UserEntity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  formatEntityRefTitle,
  isOwnerOf,
} from '@backstage/plugin-catalog-react';
import qs from 'qs';
import useAsync from 'react-use/lib/useAsync';

type EntityTypeProps = {
  kind: string;
  type: string;
  count: number;
};

const getQueryParams = (
  owner: Entity,
  selectedEntity: EntityTypeProps,
): string => {
  const ownerName = formatEntityRefTitle(owner, { defaultKind: 'group' });
  const { kind, type } = selectedEntity;
  const filters = {
    kind,
    type,
    owners: [ownerName],
    user: 'all',
  };
  if (owner.kind === 'User') {
    const user = owner as UserEntity;
    filters.owners = [...filters.owners, ...user.spec.memberOf];
  }
  const queryParams = qs.stringify({
    filters,
  });

  return queryParams;
};

export function useDirectEntities(
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

  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const kinds = entityFilterKind ?? ['Component', 'API', 'System'];
    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: kinds,
      },
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'relations',
      ],
    });

    const ownedEntitiesList = entitiesList.items.filter(component =>
      isOwnerOf(entity, component),
    );

    const counts = ownedEntitiesList.reduce(
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
      queryParams: getQueryParams(entity, topOwnedEntity),
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
