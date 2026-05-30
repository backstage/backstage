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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

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
    description: `Triggers a refresh of a single entity in the Backstage software catalog, requeueing it for processing.

This is useful immediately after creating or updating an entity (for example, via a scaffolder template invoked by an MCP client) when the new data must be visible in the catalog before subsequent actions can read it.

Each entity is identified by its kind, namespace, and name. The default kind is "Component" and the default namespace is "default".`,
    schema: {
      input: z =>
        z.object({
          kind: z
            .string()
            .describe(
              `The kind of the entity to refresh, e.g. "Component", "API", "System". Defaults to "Component" if omitted.`,
            )
            .optional(),
          namespace: z
            .string()
            .describe(
              `The namespace of the entity to refresh. Defaults to "default" if omitted.`,
            )
            .optional(),
          name: z.string().describe('The name of the entity to refresh.'),
        }),
      output: z =>
        z.object({
          entityRef: z
            .string()
            .describe('The canonical entity reference that was refreshed.'),
        }),
    },
    action: async ({ input, credentials }) => {
      const entityRef = stringifyEntityRef({
        kind: input.kind ?? 'Component',
        namespace: input.namespace ?? 'default',
        name: input.name,
      });

      const entity = await catalog.getEntityByRef(entityRef, { credentials });
      if (!entity) {
        throw new NotFoundError(`Entity '${entityRef}' not found`);
      }

      await catalog.refreshEntity(entityRef, { credentials });

      return {
        output: { entityRef },
      };
    },
  });
};
