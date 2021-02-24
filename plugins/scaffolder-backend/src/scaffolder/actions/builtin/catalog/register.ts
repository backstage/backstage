/*
 * Copyright 2021 Spotify AB
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

import { InputError } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
import { getEntityName } from '@backstage/catalog-model';
import { TemplateAction } from '../../types';

export function createCatalogRegisterAction(options: {
  catalogClient: CatalogApi;
  integrations: ScmIntegrations;
}): TemplateAction {
  const { catalogClient, integrations } = options;

  return {
    id: 'catalog:register',
    async handler(ctx) {
      const {
        repoContentsUrl,
        catalogInfoPath = '/catalog-info.yaml',
      } = ctx.parameters;

      let { catalogInfoUrl } = ctx.parameters;
      if (!catalogInfoUrl) {
        const integration = integrations.byUrl(repoContentsUrl as string);
        if (!integration) {
          throw new InputError('No integration found for host');
        }

        catalogInfoUrl = integration.resolveUrl({
          base: repoContentsUrl as string,
          url: catalogInfoPath as string,
        });
      }

      ctx.logger.info(`Registering ${catalogInfoUrl} in the catalog`);

      const result = await catalogClient.addLocation({
        type: 'url',
        target: catalogInfoUrl as string,
      });
      if (result.entities.length >= 1) {
        const { kind, name, namespace } = getEntityName(result.entities[0]);
        ctx.output('entityRef', `${kind}:${namespace}/${name}`);
        ctx.output('catalogInfoUrl', catalogInfoUrl);
      }
    },
  };
}
