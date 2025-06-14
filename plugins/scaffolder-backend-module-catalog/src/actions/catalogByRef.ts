/*
 * Copyright 2025 The Backstage Authors
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

import type { CatalogService } from '@backstage/plugin-catalog-node';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';

export const createCatalogByRefAction = ({
  catalog,
}: {
  catalog: CatalogService;
}) =>
  createTemplateAction({
    id: 'catalog:entity:by-ref',
    description: 'Get catalog entity by reference',
    schema: {
      input: {
        entityRef: z =>
          z
            .string()
            .describe(
              'Entity reference to fetch, e.g. "user:default/john.doe"',
            ),
        defaultKind: z =>
          z.string({ description: 'The default kind' }).optional(),
        defaultNamespace: z =>
          z.string({ description: 'The default namespace' }).optional(),
        optional: z =>
          z
            .boolean({
              description:
                'Allow the entity to optionally exist. Default: false',
            })
            .optional(),
      },
      output: {
        entity: z => z.any().describe('Entity'),
      },
    },
    async handler(ctx) {
      const { entityRef, optional, defaultKind, defaultNamespace } = ctx.input;

      const credentials = await ctx.getInitiatorCredentials();

      const entity = await catalog.getEntityByRef(
        stringifyEntityRef(
          parseEntityRef(entityRef, { defaultNamespace, defaultKind }),
        ),
        {
          credentials,
        },
      );

      if (!entity && !optional) {
        throw new Error(
          `Entity with reference ${entityRef} not found in the catalog`,
        );
      }

      ctx.output('entity', entity);
    },
  });
