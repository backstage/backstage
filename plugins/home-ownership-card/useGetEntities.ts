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
import {
  catalogApiRef,
  useEntityOwnership,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import qs from 'qs';

type EntityTypeProps = {
  kind: string;
  type: string;
  count: number;
};

const getQueryParams = (selectedEntity: EntityTypeProps): string => {
  const { kind, type } = selectedEntity;
  const filters = {
    kind,
    type,
    user: 'owned',
  };
  return qs.stringify({ filters });
};

export function useGetEntities(): {
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
  const kinds = ['Component', 'API', 'System', 'Resources', 'Templates'];
  const { loading: loadingOwnership, isOwnedEntity } = useEntityOwnership();
  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const allEntitiesList = await catalogApi.getEntities({
      filter: [
        {
          kind: kinds,
        },
      ],
      fields: [
        'apiVersion',
        'kind',
        'metadata',
        'relations',
        'spec.owner',
        'spec.type',
      ],
    });
    const ownedEntitiesList = allEntitiesList.items.filter((entity: Entity) => {
      if (loadingOwnership) {
        return false;
      }

      return isOwnedEntity(entity);
    });
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

    // Return top N (twenty) entities to be displayed in ownership boxes
    const topN = counts.sort((a, b) => b.count - a.count).slice(0, 20);

    return topN.map(topOwnedEntity => ({
      counter: topOwnedEntity.count,
      type: topOwnedEntity.type,
      name: topOwnedEntity.type.toLocaleUpperCase('en-US'),
      queryParams: getQueryParams(topOwnedEntity),
    })) as Array<{
      counter: number;
      type: string;
      name: string;
      queryParams: string;
    }>;
  }, [catalogApi, loadingOwnership]);

  return {
    componentsWithCounters,
    loading,
    error,
  };
}
