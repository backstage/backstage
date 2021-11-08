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
import { Entity } from '@backstage/catalog-model';
import isEmpty from 'lodash/isEmpty';

export const entityFactRetriever = {
  id: 'entityRetriever',
  version: '0.0.1',
  schema: {
    hasOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set',
    },
    hasGroupOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set and refers to a group',
    },
    hasDescription: {
      type: 'boolean',
      description: 'The entity has an owned_by relation',
    },
  },
  handler: async ({ discovery }: FactRetrieverContext) => {
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities();

    return entities.items.map((it: Entity) => {
      return {
        entity: {
          namespace: it.metadata.namespace!!,
          kind: it.kind,
          name: it.metadata.name,
        },
        facts: {
          hasOwner: Boolean(it.spec?.owner),
          hasGroupOwner: Boolean(
            it.spec?.owner && (it.spec?.owner as string).startsWith('group:'),
          ),
          hasDescription: Boolean(it.metadata?.description),
          hasTags: !isEmpty(it.metadata?.tags),
        },
      };
    });
  },
};
