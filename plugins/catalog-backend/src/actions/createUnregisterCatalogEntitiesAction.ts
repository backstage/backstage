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
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createUnregisterCatalogEntitiesAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'unregister-catalog-entities',
    title: 'Unregister Catalog Entities',
    attributes: {
      destructive: true,
      readOnly: false,
      idempotent: true,
    },
    description: `Unregister a Location and the entities it ownws.

This tool is analogous to the "unregister location" function you see in the Backstage dashboard,
where you supply the UUID for a Location entity link that allows for the removal of the Location and
the various Entities (Components, Systems, Resources, APIs, Users, and Groups) that were also created 
when the Location was imported.

If an error occurred during processing,  the 'error' field will contain a message describing the error.

Example invocation and the output from the invocation:
  # Register a Location from a GitHub URL
  unregister-catalog-entities locationId: aaa-bbb-ccc-ddd
  Output: {}      
`,
    schema: {
      input: z =>
        z.object({
          locationId: z
            .string()
            .describe(
              `Location ID returned from the 'register-catalog-entities' call.`,
            ),
        }),
      output: z =>
        z.object({
          error: z
            .string()
            .optional()
            .describe('Error message if creation fails'),
        }),
    },
    action: async ({ input, credentials }) => {
      if (!input.locationId || input.locationId === '') {
        return {
          output: {
            error: 'a location ID must be specified',
          },
        };
      }

      try {
        await catalog.removeLocationById(input.locationId, {
          credentials,
        });

        return {
          output: {
            error: undefined,
          },
        };
      } catch (error) {
        return {
          output: {
            error: error.message,
          },
        };
      }
    },
  });
};
