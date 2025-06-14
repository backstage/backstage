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

export const createCatalogByRefsAction = ({
  catalog,
}: {
  catalog: CatalogService;
}) =>
  createTemplateAction({
    id: 'catalog:entities:by-refs',
    description: 'Get catalog entities by references',
    schema: {
      input: {
        entityRefs: z =>
          z
            .array(z.string())
            .describe(
              'Entity references to fetch, e.g. ["user:default/john.doe"]',
            ),
        filter: z =>
          z
            .union([
              z.record(z.union([z.string(), z.array(z.string())])),
              z.array(z.record(z.union([z.string(), z.array(z.string())]))),
            ])
            .optional()
            .describe('A key-value based filter expression for entities'),
        fields: z =>
          z
            .array(z.string())
            .optional()
            .describe(
              'If given, return only the parts of each entity that match the field declarations',
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
        entities: z => z.array(z.any()).describe('Entities'),
      },
    },
    async handler(ctx) {
      const {
        entityRefs,
        filter,
        fields,
        defaultNamespace,
        defaultKind,
        optional,
      } = ctx.input;

      const credentials = await ctx.getInitiatorCredentials();

      const entityRefsWithDefaults = entityRefs
        .map(ref =>
          parseEntityRef(ref, {
            defaultNamespace: defaultNamespace,
            defaultKind: defaultKind,
          }),
        )
        .map(stringifyEntityRef);

      const { items } = await catalog.getEntitiesByRefs(
        { entityRefs: entityRefsWithDefaults, filter, fields },
        {
          credentials,
        },
      );

      const finalEntities = items.map((e, i) => {
        if (!e && !optional) {
          throw new Error(`Entity ${entityRefs[i]} not found`);
        }
        return e ?? null;
      });

      ctx.output('entities', finalEntities);
    },
  });
