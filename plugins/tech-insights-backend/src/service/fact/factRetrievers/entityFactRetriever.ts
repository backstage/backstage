/*
 * Copyright 2021 The Backstage Authors
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

import { FactRetrieverContext } from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';

const applicableEntityKinds = [
  'component',
  'api',
  'template',
  'domain',
  'resource',
  'system',
];

const entityKindFilter = { field: 'kind', values: applicableEntityKinds };

export const entityFactRetriever = {
  id: 'entityRetriever',
  version: '0.0.1',
  entityFilter: [
    {
      field: 'kind',
      values: applicableEntityKinds,
    },
  ],
  schema: {
    hasSpecWithOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set',
    },
    hasSpecWithGroupOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set and refers to a group',
    },
    hasOwnedByRelation: {
      type: 'boolean',
      description: 'The entity has an owned_by relation',
    },
    hasOwnedByRelationWithGroupTarget: {
      type: 'boolean',
      description: 'The entity has an owned_by relation which targets a group',
    },
  },
  handler: async ({ discovery }: FactRetrieverContext) => {
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities({
      filter: entityKindFilter,
    });

    return entities.items.map((it: Entity) => {
      return {
        entity: {
          namespace: it.metadata.namespace!!,
          kind: it.kind,
          name: it.metadata.name,
        },
        facts: {
          hasSpecWithOwner: Boolean(it.spec?.owner),
          hasSpecWithGroupOwner: Boolean(
            it.spec?.owner && (it.spec?.owner as string).startsWith('group:'),
          ),
          hasOwnedByRelation: Boolean(
            it.relations &&
              it.relations.find(({ type }) => type === RELATION_OWNED_BY),
          ),
          hasOwnedByRelationWithGroupTarget: Boolean(
            it.relations &&
              it.relations.find(
                ({ type, target }) =>
                  type === RELATION_OWNED_BY && target.kind === 'group',
              ),
          ),
        },
      };
    });
  },
};
