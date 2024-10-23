/*
 * Copyright 2024 The Backstage Authors
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

import { CatalogApi, QueryEntitiesRequest } from '@backstage/catalog-client';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { useIsMounted } from '@react-hookz/web';
import { useEffect, useRef, useState } from 'react';
import { catalogApiRef } from '../../../api';
import { Owner } from './types';

// Loads all candidates by paginating through the catalog and updating the set
// as each page arrives, but only the first time the active flag is set.
export function useAllCandidates(active: boolean): {
  loading: boolean;
  candidates: Owner[];
} {
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const mounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Owner[]>([]);
  const state = useRef<'initial' | 'loading' | 'loaded'>('initial');

  useEffect(() => {
    if (!active || state.current !== 'initial' || !mounted()) {
      return;
    }

    setLoading(true);
    state.current = 'loading';

    (async () => {
      try {
        for await (const entities of streamEntityChunks(catalogApi)) {
          if (!mounted()) {
            return;
          }
          setCandidates(previous =>
            previous.concat(entities.map(e => toOwner(e))),
          );
        }

        if (mounted()) {
          state.current = 'loaded';
          setLoading(false);
        }
      } catch (error) {
        if (mounted()) {
          errorApi.post(new ForwardedError('Failed to load owners', error));
          setLoading(false);
        }
      }
    })();
  }, [active, loading, mounted, catalogApi, errorApi]);

  return { loading, candidates };
}

// Does the actual streaming
async function* streamEntityChunks(
  catalogApi: CatalogApi,
): AsyncIterable<Entity[]> {
  const fields = [
    'kind',
    'metadata.name',
    'metadata.namespace',
    'metadata.title',
  ];

  let request: QueryEntitiesRequest = {
    filter: { kind: ['User', 'Group'] },
    fields,
    orderFields: [
      { field: 'metadata.name', order: 'asc' },
      { field: 'kind', order: 'asc' },
    ],
  };

  for (;;) {
    const { items, pageInfo } = await catalogApi.queryEntities(request);
    if (items.length) {
      yield items;
    }
    if (!pageInfo.nextCursor) {
      return;
    }
    request = {
      fields,
      cursor: pageInfo.nextCursor,
    };
  }
}

function toOwner(
  entity: Entity,
  group?: { order: number; label: string },
): Owner {
  return {
    entityRef: stringifyEntityRef(entity),
    label: entity.metadata.name,
    filterString: [entity.metadata.name, entity.metadata.title]
      .filter(Boolean)
      .join(' '),
    group,
  };
}
