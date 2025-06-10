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

export const createCatalogRefreshAction = ({
  catalog,
}: {
  catalog: CatalogService;
}) =>
  createTemplateAction({
    id: 'catalog:entity:refresh',
    description: 'Refresh catalog entity by reference',
    schema: {
      input: {
        entityRef: z =>
          z
            .string()
            .describe(
              'Entity reference to refresh, e.g. "user:default/john.doe"',
            ),
        defaultKind: z =>
          z.string({ description: 'The default kind' }).optional(),
        defaultNamespace: z =>
          z.string({ description: 'The default namespace' }).optional(),
      },
      output: {},
    },
    async handler(ctx) {
      const { entityRef, defaultKind, defaultNamespace } = ctx.input;

      const credentials = await ctx.getInitiatorCredentials();

      await catalog.refreshEntity(
        stringifyEntityRef(
          parseEntityRef(entityRef, { defaultKind, defaultNamespace }),
        ),
        {
          credentials,
        },
      );
    },
  });
