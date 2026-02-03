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

import { RELATION_OWNED_BY, Entity } from '@backstage/catalog-model';
import {
  getEntityRelations,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { toLowerMaybe } from '../../../helpers';
import { ConfigApi, RouteFunc } from '@backstage/core-plugin-api';

type getRouteFunc = RouteFunc<{
  namespace: string;
  kind: string;
  name: string;
}>;

export function entitiesToDocsMapper(
  entities: Entity[],
  getRouteToReaderPageFor: getRouteFunc,
  config: ConfigApi,
) {
  return entities.map(entity => {
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
    return {
      entity,
      resolved: {
        docsUrl: getRouteToReaderPageFor({
          namespace: toLowerMaybe(
            entity.metadata.namespace ?? 'default',
            config,
          ),
          kind: toLowerMaybe(entity.kind, config),
          name: toLowerMaybe(entity.metadata.name, config),
        }),
        ownedByRelations,
        ownedByRelationsTitle: ownedByRelations
          .map(r => humanizeEntityRef(r, { defaultKind: 'group' }))
          .join(', '),
      },
    };
  });
}
