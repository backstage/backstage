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
import { entityHasAnnotation, generateAnnotationFactName } from './utils';

const techdocsAnnotation = 'backstage.io/techdocs-ref';
const techdocsAnnotationFactName =
  generateAnnotationFactName(techdocsAnnotation);

/**
 * Generates facts related to the completeness of techdocs configuration for entities.
 *
 * @public
 */
export const techdocsFactRetriever: FactRetriever = {
  id: 'techdocsFactRetriever',
  version: '0.0.1',
  title: 'Tech Docs',
  description:
    'Generates facts related to the completeness of techdocs configuration for entities',
  schema: {
    [techdocsAnnotationFactName]: {
      type: 'boolean',
      description: 'The entity has a TechDocs reference annotation',
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
          [techdocsAnnotationFactName]: entityHasAnnotation(
            entity,
            techdocsAnnotation,
          ),
        },
      };
    });
  },
};
