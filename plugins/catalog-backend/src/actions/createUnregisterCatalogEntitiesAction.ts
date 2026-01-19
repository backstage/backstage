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
import { NotFoundError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createUnregisterCatalogEntitiesAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'unregister-entity',
    title: 'Unregister entity from the Catalog',
    attributes: {
      destructive: true,
      readOnly: false,
      idempotent: true,
    },
    description: `Unregisters a Location entity and all entities it owns from the Backstage catalog.

This action is similar to the "Unregister location" function in the Backstage UI, where you provide the unique identifier (locationId) of a Location entity. Alternatively, you can provide the URL used to register the location. The action will remove the specified Location from the catalog as well as all entities that were created when the Location was imported.

Once completed, all entities associated with the Location will be deleted from the catalog.
`,
    schema: {
      input: z =>
        z
          .object({
            type: z.union([
              z.object({
                locationId: z
                  .string()
                  .describe(`Location ID of the Entity to unregister`),
              }),
              z.object({
                locationUrl: z
                  .string()
                  .describe(
                    `URL of the catalog-info.yaml file to unregister for example: https://github.com/backstage/demo/blob/master/catalog-info.yaml`,
                  ),
              }),
            ]),
          })
          .describe(
            'The type to the unregister-entity action. Either locationId or locationUrl must be provided.',
          ),
      output: z => z.object({}),
    },
    action: async ({ input: { type }, credentials }) => {
      if ('locationId' in type) {
        await catalog.removeLocationById(type.locationId, {
          credentials,
        });
      } else {
        const locations = await catalog
          .getLocations(
            {},
            {
              credentials,
            },
          )
          .then(response =>
            response.items.filter(
              location =>
                location.target.toLowerCase() ===
                type.locationUrl.toLowerCase(),
            ),
          );

        if (locations.length === 0) {
          throw new NotFoundError(
            `Location with URL ${type.locationUrl} not found`,
          );
        }

        for (const location of locations) {
          await catalog.removeLocationById(location.id, {
            credentials,
          });
        }
      }

      return { output: {} };
    },
  });
};
