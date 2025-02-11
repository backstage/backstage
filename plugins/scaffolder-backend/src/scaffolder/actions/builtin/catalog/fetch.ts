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
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { examples } from './fetch.examples';
import { AuthService } from '@backstage/backend-plugin-api';

const id = 'catalog:fetch';

/**
 * Returns entity or entities from the catalog by entity reference(s).
 *
 * @public
 */
export function createFetchCatalogEntityAction(options: {
  catalogClient: CatalogApi;
  auth?: AuthService;
}) {
  const { catalogClient, auth } = options;

  return createTemplateAction({
    id,
    description:
      'Returns entity or entities from the catalog by entity reference(s)',
    examples,
    supportsDryRun: true,
    schema: {
      input: {
        entityRef: z =>
          z
            .string({
              description: 'Entity reference of the entity to get',
            })
            .optional(),
        entityRefs: z =>
          z
            .array(z.string(), {
              description: 'Entity references of the entities to get',
            })
            .optional(),
        optional: z =>
          z
            .boolean({
              description:
                'Allow the entity or entities to optionally exist. Default: false',
            })
            .optional(),
        defaultKind: z =>
          z.string({ description: 'The default kind' }).optional(),
        defaultNamespace: z =>
          z.string({ description: 'The default namespace' }).optional(),
      },
      output: {
        entity: z =>
          z
            .any({
              description:
                'Object containing same values used in the Entity schema. Only when used with `entityRef` parameter.',
            })
            .optional(),
        entities: z =>
          z
            .array(
              z.any({
                description:
                  'Array containing objects with same values used in the Entity schema. Only when used with `entityRefs` parameter.',
              }),
            )
            .optional(),
      },
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

      const { token } = (await auth?.getPluginRequestToken({
        onBehalfOf: await ctx.getInitiatorCredentials(),
        targetPluginId: 'catalog',
      })) ?? { token: ctx.secrets?.backstageToken };

      if (entityRef) {
        const entity = await catalogClient.getEntityByRef(
          stringifyEntityRef(
            parseEntityRef(entityRef, { defaultKind, defaultNamespace }),
          ),
          {
            token,
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
            token,
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
