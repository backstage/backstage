/*
 * Copyright 2022 The Backstage Authors
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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  PermissionEvaluator,
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import {
  azureSitesActionPermission,
  azureSitesPermissions,
  AZURE_WEB_SITE_NAME_ANNOTATION,
} from '@backstage/plugin-azure-sites-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { CatalogApi } from '@backstage/catalog-client';

import { AzureSitesApi } from '../api';

/** @public */
export interface RouterOptions {
  logger: Logger;
  azureSitesApi: AzureSitesApi;
  catalogApi: CatalogApi;
  permissions: PermissionEvaluator;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, azureSitesApi, permissions, catalogApi } = options;

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: azureSitesPermissions,
  });

  const router = Router();
  router.use(express.json());
  router.use(permissionIntegrationRouter);

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.get('/list/:name', async (request, response) => {
    const { name } = request.params;
    response.json(
      await azureSitesApi.list({
        name: name,
      }),
    );
  });
  router.post(
    '/:subscription/:resourceGroup/:name/start',
    async (request, response) => {
      const { subscription, resourceGroup, name } = request.params;
      const token = getBearerTokenFromAuthorizationHeader(
        request.header('authorization'),
      );
      const entityRef = request.body.entityRef;
      if (typeof entityRef !== 'string') {
        throw new InputError('Invalid entityRef, not a string');
      }
      const entity = await catalogApi.getEntityByRef(entityRef, { token });

      if (entity) {
        const annotationName =
          entity.metadata.annotations?.[AZURE_WEB_SITE_NAME_ANNOTATION];
        if (
          annotationName &&
          !(await azureSitesApi.validateSite(annotationName, name))
        ) {
          throw new NotFoundError();
        }

        const decision = permissions
          ? (
              await permissions.authorize(
                [
                  {
                    permission: azureSitesActionPermission,
                    resourceRef: entityRef,
                  },
                ],
                {
                  token,
                },
              )
            )[0]
          : undefined;
        if (decision && decision.result === AuthorizeResult.DENY) {
          throw new NotAllowedError('Unauthorized');
        }

        logger.info(
          `entity ${entity.metadata.name} - azure site "${name}" is starting...`,
        );
        response.json(
          await azureSitesApi.start({
            subscription,
            resourceGroup,
            name,
          }),
        );
      } else {
        throw new NotFoundError();
      }
    },
  );
  router.post(
    '/:subscription/:resourceGroup/:name/stop',
    async (request, response) => {
      const { subscription, resourceGroup, name } = request.params;
      const token = getBearerTokenFromAuthorizationHeader(
        request.header('authorization'),
      );

      const entityRef = request.body.entityRef;
      if (typeof entityRef !== 'string') {
        throw new InputError('Invalid entityRef, not a string');
      }
      const entity = await catalogApi.getEntityByRef(entityRef, { token });

      if (entity) {
        const annotationName =
          entity.metadata.annotations?.[AZURE_WEB_SITE_NAME_ANNOTATION];

        if (
          annotationName &&
          !(await azureSitesApi.validateSite(annotationName, name))
        ) {
          throw new NotFoundError('annotation mismatched!');
        }

        const decision = permissions
          ? (
              await permissions.authorize(
                [
                  {
                    permission: azureSitesActionPermission,
                    resourceRef: entityRef,
                  },
                ],
                {
                  token,
                },
              )
            )[0]
          : undefined;
        if (decision && decision.result === AuthorizeResult.DENY) {
          throw new NotAllowedError('Unauthorized');
        }

        logger.info(
          `entity ${entity.metadata.name} - azure site "${name}" is stopping...`,
        );
        response.json(
          await azureSitesApi.stop({
            subscription,
            resourceGroup,
            name,
          }),
        );
      } else {
        throw new NotFoundError();
      }
    },
  );
  router.use(errorHandler());
  return router;
}
