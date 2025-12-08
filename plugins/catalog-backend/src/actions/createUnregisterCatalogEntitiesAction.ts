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
import { ForwardedError, InputError } from '@backstage/errors';

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
      output: z => z.object({}),
    },
    action: async ({ input, credentials }) => {
      if (!input.locationId || input.locationId === '') {
        throw new InputError('a locationID must be specified');
      }

      try {
        await catalog.removeLocationById(input.locationId, {
          credentials,
        });
      } catch (error) {
        throw new ForwardedError(
          `catalog removal of "${input.locationId} failed"`,
          error,
        );
      }
      return { output: {} };
    },
  });
};
