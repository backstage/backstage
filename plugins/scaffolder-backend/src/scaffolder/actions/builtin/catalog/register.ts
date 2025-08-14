/*
 * Copyright 2021 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { stringifyEntityRef, Entity } from '@backstage/catalog-model';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './register.examples';
import { CatalogService } from '@backstage/plugin-catalog-node';

const id = 'catalog:register';

/**
 * Registers entities from a catalog descriptor file in the workspace into the software catalog.
 * @public
 */
export function createCatalogRegisterAction(options: {
  catalog: CatalogService;
  integrations: ScmIntegrations;
}) {
  const { catalog, integrations } = options;

  return createTemplateAction({
    id,
    description:
      'Registers entities from a catalog descriptor file in the workspace into the software catalog.',
    examples,
    schema: {
      input: z =>
        z.union([
          z.object({
            catalogInfoUrl: z.string({
              description:
                'An absolute URL pointing to the catalog info file location',
            }),
            optional: z
              .boolean({
                description:
                  'Permit the registered location to optionally exist. Default: false',
              })
              .optional(),
          }),
          z.object({
            repoContentsUrl: z.string({
              description:
                'An absolute URL pointing to the root of a repository directory tree',
            }),
            catalogInfoPath: z
              .string({
                description:
                  'A relative path from the repo root pointing to the catalog info file, defaults to /catalog-info.yaml',
              })
              .optional(),
            optional: z
              .boolean({
                description:
                  'Permit the registered location to optionally exist. Default: false',
              })
              .optional(),
          }),
        ]),
    },
    async handler(ctx) {
      const { input } = ctx;

      let catalogInfoUrl;
      if ('catalogInfoUrl' in input) {
        catalogInfoUrl = input.catalogInfoUrl;
      } else {
        const { repoContentsUrl, catalogInfoPath = '/catalog-info.yaml' } =
          input;
        const integration = integrations.byUrl(repoContentsUrl);
        if (!integration) {
          throw new InputError(
            `No integration found for host ${repoContentsUrl}`,
          );
        }

        catalogInfoUrl = integration.resolveUrl({
          base: repoContentsUrl,
          url: catalogInfoPath,
        });
      }

      ctx.logger.info(`Registering ${catalogInfoUrl} in the catalog`);

      try {
        // 1st try to register the location, this will throw an error if the location already exists (see catch)
        await catalog.addLocation(
          {
            type: 'url',
            target: catalogInfoUrl,
          },
          { credentials: await ctx.getInitiatorCredentials() },
        );
      } catch (e) {
        if (!input.optional) {
          // if optional is false or unset, it is not allowed to register the same location twice, we rethrow the error
          throw e;
        }
      }

      try {
        // 2nd retry the registration as a dry run, this will not throw an error if the location already exists
        const result = await catalog.addLocation(
          {
            dryRun: true,
            type: 'url',
            target: catalogInfoUrl,
          },
          { credentials: await ctx.getInitiatorCredentials() },
        );

        if (result.entities.length) {
          const { entities } = result;
          let entity: Entity | undefined;
          // prioritise 'Component' type as it is the most central kind of entity
          entity = entities.find(
            e =>
              !e.metadata.name.startsWith('generated-') &&
              e.kind === 'Component',
          );
          if (!entity) {
            entity = entities.find(
              e => !e.metadata.name.startsWith('generated-'),
            );
          }
          if (!entity) {
            entity = entities[0];
          }

          ctx.output('entityRef', stringifyEntityRef(entity));
        }
      } catch (e) {
        if (!input.optional) {
          throw e;
        }
      }

      ctx.output('catalogInfoUrl', catalogInfoUrl);
    },
  });
}
