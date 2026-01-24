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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ConflictError, InputError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createGetCatalogEntityAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-catalog-entity',
    title: 'Get Catalog Entity',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `
This allows you to get a single entity from the software catalog.
Each entity in the software catalog has a unique name, kind, and namespace. The default namespace is "default".
Each entity is identified by a unique entity reference, which is a string of the form "kind:namespace/name".
    `,
    schema: {
      input: z =>
        z.object({
          kind: z
            .string()
            .describe(
              'The kind of the entity to query. If the kind is unknown it can be omitted.',
            )
            .optional(),
          namespace: z
            .string()
            .describe(
              'The namespace of the entity to query. If the namespace is unknown it can be omitted.',
            )
            .optional(),
          name: z.string().describe('The name of the entity to query'),
        }),
      // TODO: is there a better way to do this?
      output: z => z.object({}).passthrough(),
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
        {
          credentials,
        },
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

      const [entity] = items;

      return {
        output: entity,
      };
    },
  });
};
