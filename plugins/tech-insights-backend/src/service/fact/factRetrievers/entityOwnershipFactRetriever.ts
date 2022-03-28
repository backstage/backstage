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

import {
  FactRetriever,
  FactRetrieverContext,
} from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';

/**
 * Generates facts which indicate the quality of data in the spec.owner field.
 *
 * @public
 */
export const entityOwnershipFactRetriever: FactRetriever = {
  id: 'entityOwnershipFactRetriever',
  version: '0.0.1',
  entityFilter: [
    { kind: ['component', 'domain', 'system', 'api', 'resource', 'template'] },
  ],
  schema: {
    hasOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set',
    },
    hasGroupOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set and refers to a group',
    },
  },
  handler: async ({ discovery, entityFilter }: FactRetrieverContext) => {
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities({ filter: entityFilter });

    return entities.items.map((entity: Entity) => {
      return {
        entity: {
          namespace: entity.metadata.namespace!,
          kind: entity.kind,
          name: entity.metadata.name,
        },
        facts: {
          hasOwner: Boolean(entity.spec?.owner),
          hasGroupOwner: Boolean(
            entity.spec?.owner &&
              !(entity.spec?.owner as string).startsWith('user:'),
          ),
        },
      };
    });
  },
};
