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
import { z } from 'zod';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';

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

  return createTemplateAction({
    id,
    description:
      'Returns entity or entities from the catalog by entity reference(s)',
    examples,
    supportsDryRun: true,
    schema: {
      input: z.object({
        entityRef: z
          .string({
            description: 'Entity reference of the entity to get',
          })
          .optional(),
        entityRefs: z
          .array(z.string(), {
            description: 'Entity references of the entities to get',
          })
          .optional(),
        optional: z
          .boolean({
            description:
              'Allow the entity or entities to optionally exist. Default: false',
          })
          .optional(),
        defaultKind: z.string({ description: 'The default kind' }).optional(),
        defaultNamespace: z
          .string({ description: 'The default namespace' })
          .optional(),
      }),
      output: z.object({
        entity: z
          .any({
            description:
              'Object containing same values used in the Entity schema. Only when used with `entityRef` parameter.',
          })
          .optional(),
        entities: z
          .array(
            z.any({
              description:
                'Array containing objects with same values used in the Entity schema. Only when used with `entityRefs` parameter.',
            }),
          )
          .optional(),
      }),
    },
    async handler(ctx) {
      const { entityRef, entityRefs, optional, defaultKind, defaultNamespace } =
        ctx.input;
      if (!entityRef && !entityRefs) {
        if (optional) {
          return;
        }
        throw new Error('Missing entity reference or references');
      }

      if (entityRef) {
        const entity = await catalogClient.getEntityByRef(
          stringifyEntityRef(
            parseEntityRef(entityRef, { defaultKind, defaultNamespace }),
          ),
          {
            token: ctx.secrets?.backstageToken,
          },
        );

        if (!entity && !optional) {
          throw new Error(`Entity ${entityRef} not found`);
        }
        ctx.output('entity', entity ?? null);
      }

      if (entityRefs) {
        const entities = await catalogClient.getEntitiesByRefs(
          {
            entityRefs: entityRefs.map(ref =>
              stringifyEntityRef(
                parseEntityRef(ref, { defaultKind, defaultNamespace }),
              ),
            ),
          },
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
