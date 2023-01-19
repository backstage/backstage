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
import { createTemplateAction } from '../../createTemplateAction';
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
];

/**
 * Returns entity from the catalog by entity reference.
 * @public
 */
export function createFetchCatalogEntityAction(options: {
  catalogClient: CatalogApi;
}) {
  const { catalogClient } = options;

  return createTemplateAction<{ entityRef: string; optional?: boolean }>({
    id,
    description: 'Returns entity from the catalog by entity reference',
    examples,
    schema: {
      input: {
        required: ['entityRef'],
        type: 'object',
        properties: {
          entityRef: {
            type: 'string',
            title: 'Entity reference',
            description: 'Entity reference of the entity to get',
          },
          optional: {
            title: 'Optional',
            description:
              'Permit the entity to optionally exist. Default: false',
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
              'Object containing same values used in the Entity schema.',
          },
        },
      },
    },
    async handler(ctx) {
      const { entityRef, optional } = ctx.input;
      let entity;
      try {
        entity = await catalogClient.getEntityByRef(entityRef, {
          token: ctx.secrets?.backstageToken,
        });
      } catch (e) {
        if (!optional) {
          throw e;
        }
      }
      ctx.output('entity', entity ?? null);
    },
  });
}
