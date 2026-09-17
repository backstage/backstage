/*
 * Copyright 2026 The Backstage Authors
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
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ConflictError, InputError } from '@backstage/errors';
import type { CatalogService } from '@backstage/plugin-catalog-node';

export const createRefreshCatalogEntityAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'refresh-catalog-entity',
    title: 'Refresh Catalog Entity',
    attributes: {
      destructive: false,
      readOnly: false,
      idempotent: true,
    },
    description: `
This allows you to trigger a refresh of a single entity in the software catalog, requeuing it for processing.
This is useful immediately after creating or updating an entity (for example via a scaffolder template invoked by an MCP client) so the new data becomes visible before subsequent actions read it.
Each entity in the software catalog has a unique name, kind, and namespace. If the name alone matches multiple entities, provide the kind (and namespace) to disambiguate.
    `,
    schema: {
      input: z =>
        z.object({
          kind: z
            .string()
            .min(1)
            .describe(
              'The kind of the entity to refresh, e.g. "Component", "API", "System". If the kind is unknown it can be omitted.',
            )
            .optional(),
          namespace: z
            .string()
            .min(1)
            .describe(
              'The namespace of the entity to refresh. If the namespace is unknown it can be omitted.',
            )
            .optional(),
          name: z
            .string()
            .trim()
            .min(1)
            .describe('The name of the entity to refresh.'),
        }),
      output: z =>
        z.object({
          entityRef: z
            .string()
            .describe('The canonical entity reference that was refreshed.'),
        }),
    },
    action: async ({ input, credentials }) => {
      const filter: Record<string, string> = { 'metadata.name': input.name };

      if (input.kind) {
        filter.kind = input.kind;
      }

      if (input.namespace) {
        filter['metadata.namespace'] = input.namespace;
      }

      const { items } = await catalog.queryEntities(
        { filter },
        { credentials },
      );

      if (items.length === 0) {
        throw new InputError(`No entity found with name "${input.name}"`);
      }

      if (items.length > 1) {
        throw new ConflictError(
          `Multiple entities found with name "${
            input.name
          }", please provide more specific filters. Entities found: ${items
            .map(item => `"${stringifyEntityRef(item)}"`)
            .join(', ')}`,
        );
      }

      const entityRef = stringifyEntityRef(items[0]);

      await catalog.refreshEntity(entityRef, { credentials });

      return {
        output: { entityRef },
      };
    },
  });
};
