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
import { PermissionsService, AuthService } from '@backstage/backend-plugin-api';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { Location } from '@backstage/catalog-client';
import {
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

export const createUnregisterCatalogEntitiesAction = ({
  catalog,
  actionsRegistry,
  permissions,
  auth,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
  permissions: PermissionsService;
  auth: AuthService;
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
        z.object({
          type: z
            .union([
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
            ])
            .describe(
              'Identifies the entity to unregister. Provide either locationId or locationUrl.',
            ),
        }),
      output: z => z.object({}),
    },
    action: async ({ input: { type }, credentials }) => {
      let locations: Location[] = [];
      const serviceCredentials = await auth.getOwnServiceCredentials();

      if ('locationId' in type) {
        const location = await catalog.getLocationById(type.locationId, {
          credentials: serviceCredentials,
        });
        if (!location) {
          throw new NotFoundError(
            `Location with ID ${type.locationId} not found`,
          );
        }
        locations = [location];
      } else {
        const response = await catalog.getLocations(
          {},
          {
            credentials: serviceCredentials,
          },
        );
        locations = response.items.filter(
          location =>
            location.target.toLowerCase() === type.locationUrl.toLowerCase(),
        );

        if (locations.length === 0) {
          throw new NotFoundError(
            `Location with URL ${type.locationUrl} not found`,
          );
        }
      }

      const entitiesToCheck: string[] = [];
      for (const location of locations) {
        if (location.entityRef) {
          entitiesToCheck.push(location.entityRef);
        }
        const originLocationRef = `${location.type}:${location.target}`;
        const colocated = await catalog.getEntities(
          {
            filter: {
              [`metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`]:
                originLocationRef,
            },
            fields: ['kind', 'metadata.name', 'metadata.namespace'],
          },
          {
            credentials: serviceCredentials,
          },
        );
        for (const entity of colocated.items) {
          const ref = stringifyEntityRef(entity);
          if (!entitiesToCheck.includes(ref)) {
            entitiesToCheck.push(ref);
          }
        }
      }

      if (entitiesToCheck.length > 0) {
        const authorizationResults = await permissions.authorize(
          entitiesToCheck.map(entityRef => ({
            permission: catalogEntityDeletePermission,
            resourceRef: entityRef,
          })),
          { credentials },
        );

        for (const { result } of authorizationResults) {
          if (result === AuthorizeResult.DENY) {
            throw new NotAllowedError(
              'You are not authorized to delete some of the entities managed by this location.',
            );
          }
        }
      }

      for (const location of locations) {
        await catalog.removeLocationById(location.id, {
          credentials,
        });
      }

      return { output: {} };
    },
  });
};
