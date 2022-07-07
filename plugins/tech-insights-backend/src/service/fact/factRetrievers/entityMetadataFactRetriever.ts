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
import isEmpty from 'lodash/isEmpty';

/**
 * Generates facts which indicate the completeness of entity metadata.
 *
 * @public
 */
export const entityMetadataFactRetriever: FactRetriever = {
  id: 'entityMetadataFactRetriever',
  version: '0.0.1',
  title: 'Entity Metadata',
  description:
    'Generates facts which indicate the completeness of entity metadata',
  schema: {
    hasTitle: {
      type: 'boolean',
      description: 'The entity has a title in metadata',
    },
    hasDescription: {
      type: 'boolean',
      description: 'The entity has a description in metadata',
    },
    hasTags: {
      type: 'boolean',
      description: 'The entity has tags in metadata',
    },
  },
  handler: async ({
    discovery,
    entityFilter,
    tokenManager,
  }: FactRetrieverContext) => {
    const { token } = await tokenManager.getToken();
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities(
      { filter: entityFilter },
      { token },
    );

    return entities.items.map((entity: Entity) => {
      return {
        entity: {
          namespace: entity.metadata.namespace!,
          kind: entity.kind,
          name: entity.metadata.name,
        },
        facts: {
          hasTitle: Boolean(entity.metadata?.title),
          hasDescription: Boolean(entity.metadata?.description),
          hasTags: !isEmpty(entity.metadata?.tags),
        },
      };
    });
  },
};
