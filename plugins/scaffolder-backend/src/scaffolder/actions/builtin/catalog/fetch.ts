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

import { CatalogApi } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

const id = 'catalog:fetch';

const examples = [
  {
    description: 'Fetch entity by reference',
    example: yaml.stringify({
      steps: [
        {
          action: id,
          id: 'fetch',
          name: 'Fetch catalog entity',
          input: {
            entityRef: 'component:default/name',
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch multiple entities by referencse',
    example: yaml.stringify({
      steps: [
        {
          action: id,
          id: 'fetchMultiple',
          name: 'Fetch catalog entities',
          input: {
            entityRefs: ['component:default/name'],
          },
        },
      ],
    }),
  },
];

/**
 * Returns entity or entities from the catalog by entity reference(s).
 *
 * @public
 */
export function createFetchCatalogEntityAction(options: {
  catalogClient: CatalogApi;
}) {
  const { catalogClient } = options;

  return createTemplateAction<{
    entityRef?: string;
    entityRefs?: string[];
    optional?: boolean;
  }>({
    id,
    description:
      'Returns entity or entities from the catalog by entity reference(s)',
    examples,
    schema: {
      input: {
        type: 'object',
        properties: {
          entityRef: {
            type: 'string',
            title: 'Entity reference',
            description: 'Entity reference of the entity to get',
          },
          entityRefs: {
            type: 'array',
            title: 'Entity references',
            description: 'Entity references of the entities to get',
          },
          optional: {
            title: 'Optional',
            description:
              'Allow the entity or entities to optionally exist. Default: false',
            type: 'boolean',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          entity: {
            title: 'Entity found by the entity reference',
            type: 'object',
            description:
              'Object containing same values used in the Entity schema. Only when used with `entityRef` parameter.',
          },
          entities: {
            title: 'Entities found by the entity references',
            type: 'array',
            items: { type: 'object' },
            description:
              'Array containing objects with same values used in the Entity schema. Only when used with `entityRefs` parameter.',
          },
        },
      },
    },
    async handler(ctx) {
      const { entityRef, entityRefs, optional } = ctx.input;
      if (!entityRef && !entityRefs) {
        if (optional) {
          return;
        }
        throw new Error('Missing entity reference or references');
      }

      if (entityRef) {
        const entity = await catalogClient.getEntityByRef(entityRef, {
          token: ctx.secrets?.backstageToken,
        });

        if (!entity && !optional) {
          throw new Error(`Entity ${entityRef} not found`);
        }
        ctx.output('entity', entity ?? null);
      }

      if (entityRefs) {
        const entities = await catalogClient.getEntitiesByRefs(
          { entityRefs },
          {
            token: ctx.secrets?.backstageToken,
          },
        );

        const finalEntities = entities.items.map((e, i) => {
          if (!e && !optional) {
            throw new Error(`Entity ${entityRefs[i]} not found`);
          }
          return e ?? null;
        });

        ctx.output('entities', finalEntities);
      }
    },
  });
}
