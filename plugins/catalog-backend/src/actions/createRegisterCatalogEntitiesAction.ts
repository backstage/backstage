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
import { InputError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

const isValidUrl = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const createRegisterCatalogEntitiesAction = ({
  catalog,
  actionsRegistry,
}: {
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'register-entity',
    title: 'Register entity in the Catalog',
    attributes: {
      destructive: false,
      readOnly: false,
      idempotent: false,
    },
    description: `Registers one or more entities in the Backstage catalog by creating a Location entity that points to a remote catalog-info.yaml file.

This action is similar to the "Register existing component" flow in the Backstage UI, where you provide a URL to a catalog-info.yaml file describing catalog entities such as Components, Systems, Resources, APIs, Users, and Groups. The action will create a new Location entity that references the provided file; all entities defined within that file will be imported into the catalog.

A unique identifier (locationId) will be returned for the newly created Location. You can use this identifier in the future to unregister or delete the Location and all entities it owns.
`,
    schema: {
      input: z =>
        z.object({
          locationUrl: z
            .string()
            .describe(
              `URL reference to the catalog-info.yaml file that describes the entity to register. For example: https://github.com/backstage/demo/blob/master/catalog-info.yaml`,
            ),
        }),
      output: z =>
        z.object({
          locationId: z
            .string()
            .describe('The ID of the entity that was registered'),
        }),
    },
    action: async ({ input, credentials }) => {
      if (!isValidUrl(input.locationUrl)) {
        throw new InputError(`${input.locationUrl} is an invalid URL`);
      }

      const result = await catalog.addLocation(
        {
          type: 'url',
          target: input.locationUrl,
        },
        {
          credentials,
        },
      );

      return {
        output: {
          locationId: result.location.id,
        },
      };
    },
  });
};
