/*
 * Copyright 2020 The Backstage Authors
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
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  parseLocationRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotFoundError, serializeError } from '@backstage/errors';
import express from 'express';
import { Logger } from 'winston';
import yn from 'yn';
import { z } from 'zod';
import { EntitiesCatalog } from '../catalog/types';
import { LocationAnalyzer } from '../ingestion/types';
import { CatalogProcessingOrchestrator } from '../processing/types';
import { validateEntityEnvelope } from '../processing/util';
import {
  basicEntityFilter,
  entitiesBatchRequest,
  parseEntityFilterParams,
  parseEntityTransformParams,
  parseQueryEntitiesParams,
} from './request';
import { parseEntityFacetParams } from './request/parseEntityFacetParams';
import { parseEntityOrderParams } from './request/parseEntityOrderParams';
import { LocationService, RefreshOptions, RefreshService } from './types';
import {
  disallowReadonlyMode,
  encodeCursor,
  locationInput,
  validateRequestBody,
} from './util';
import { createOpenApiRouter } from '../schema/openapi.generated';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { parseEntityPaginationParams } from './request/parseEntityPaginationParams';

/**
 * Options used by {@link createRouter}.
 *
 * @public
 */
export interface RouterOptions {
  entitiesCatalog?: EntitiesCatalog;
  locationAnalyzer?: LocationAnalyzer;
  locationService: LocationService;
  orchestrator?: CatalogProcessingOrchestrator;
  refreshService?: RefreshService;
  scheduler?: PluginTaskScheduler;
  logger: Logger;
  config: Config;
  permissionIntegrationRouter?: express.Router;
}

/**
 * Creates a catalog router.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = await createOpenApiRouter({
    validatorOptions: {
      // We want the spec to be up to date with the expected value, but the return type needs
      //  to be controlled by the router implementation not the request validator.
      ignorePaths: /^\/validate-entity\/?$/,
    },
  });
  const {
    entitiesCatalog,
    locationAnalyzer,
    locationService,
    orchestrator,
    refreshService,
    config,
    logger,
    permissionIntegrationRouter,
  } = options;

  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;
  if (readonlyEnabled) {
    logger.info('Catalog is running in readonly mode');
  }

  if (refreshService) {
    router.post('/refresh', async (req, res) => {
      const refreshOptions: RefreshOptions = req.body;
      refreshOptions.authorizationToken = getBearerTokenFromAuthorizationHeader(
        req.header('authorization'),
      );

      await refreshService.refresh(refreshOptions);
      res.status(200).end();
    });
  }

  if (permissionIntegrationRouter) {
    router.use(permissionIntegrationRouter);
  }

  if (entitiesCatalog) {
    router
      .get('/entities', async (req, res) => {
        const { entities, pageInfo } = await entitiesCatalog.entities({
          filter: parseEntityFilterParams(req.query),
          fields: parseEntityTransformParams(req.query),
          order: parseEntityOrderParams(req.query),
          pagination: parseEntityPaginationParams(req.query),
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });

        // Add a Link header to the next page
        if (pageInfo.hasNextPage) {
          const url = new URL(`http://ignored${req.url}`);
          url.searchParams.delete('offset');
          url.searchParams.set('after', pageInfo.endCursor);
          res.setHeader('link', `<${url.pathname}${url.search}>; rel="next"`);
        }

        // TODO(freben): encode the pageInfo in the response
        res.json(entities);
      })
      .get('/entities/by-query', async (req, res) => {
        const { items, pageInfo, totalItems } =
          await entitiesCatalog.queryEntities({
            limit: req.query.limit,
            ...parseQueryEntitiesParams(req.query),
            authorizationToken: getBearerTokenFromAuthorizationHeader(
              req.header('authorization'),
            ),
          });

        res.json({
          items,
          totalItems,
          pageInfo: {
            ...(pageInfo.nextCursor && {
              nextCursor: encodeCursor(pageInfo.nextCursor),
            }),
            ...(pageInfo.prevCursor && {
              prevCursor: encodeCursor(pageInfo.prevCursor),
            }),
          },
        });
      })
      .get('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        const { entities } = await entitiesCatalog.entities({
          filter: basicEntityFilter({ 'metadata.uid': uid }),
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        if (!entities.length) {
          throw new NotFoundError(`No entity with uid ${uid}`);
        }
        res.status(200).json(entities[0]);
      })
      .delete('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        await entitiesCatalog.removeEntityByUid(uid, {
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(204).end();
      })
      .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const { entities } = await entitiesCatalog.entities({
          filter: basicEntityFilter({
            kind: kind,
            'metadata.namespace': namespace,
            'metadata.name': name,
          }),
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        if (!entities.length) {
          throw new NotFoundError(
            `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
          );
        }
        res.status(200).json(entities[0]);
      })
      .get(
        '/entities/by-name/:kind/:namespace/:name/ancestry',
        async (req, res) => {
          const { kind, namespace, name } = req.params;
          const entityRef = stringifyEntityRef({ kind, namespace, name });
          const response = await entitiesCatalog.entityAncestry(entityRef, {
            authorizationToken: getBearerTokenFromAuthorizationHeader(
              req.header('authorization'),
            ),
          });
          res.status(200).json(response);
        },
      )
      .post('/entities/by-refs', async (req, res) => {
        const request = entitiesBatchRequest(req);
        const token = getBearerTokenFromAuthorizationHeader(
          req.header('authorization'),
        );
        const response = await entitiesCatalog.entitiesBatch({
          entityRefs: request.entityRefs,
          fields: parseEntityTransformParams(req.query, request.fields),
          authorizationToken: token,
        });
        res.status(200).json(response);
      })
      .get('/entity-facets', async (req, res) => {
        const response = await entitiesCatalog.facets({
          filter: parseEntityFilterParams(req.query),
          facets: parseEntityFacetParams(req.query),
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(200).json(response);
      });
  }

  if (locationService) {
    router
      .post('/locations', async (req, res) => {
        const location = await validateRequestBody(req, locationInput);
        const dryRun = yn(req.query.dryRun, { default: false });

        // when in dryRun addLocation is effectively a read operation so we don't
        // need to disallow readonly
        if (!dryRun) {
          disallowReadonlyMode(readonlyEnabled);
        }

        const output = await locationService.createLocation(location, dryRun, {
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(201).json(output);
      })
      .get('/locations', async (req, res) => {
        const locations = await locationService.listLocations({
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(200).json(locations.map(l => ({ data: l })));
      })

      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationService.getLocation(id, {
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(200).json(output);
      })
      .delete('/locations/:id', async (req, res) => {
        disallowReadonlyMode(readonlyEnabled);

        const { id } = req.params;
        await locationService.deleteLocation(id, {
          authorizationToken: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        });
        res.status(204).end();
      })
      .get('/locations/by-entity/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const output = await locationService.getLocationByEntity(
          { kind, namespace, name },
          {
            authorizationToken: getBearerTokenFromAuthorizationHeader(
              req.header('authorization'),
            ),
          },
        );
        res.status(200).json(output);
      });
  }

  if (locationAnalyzer) {
    router.post('/analyze-location', async (req, res) => {
      const body = await validateRequestBody(
        req,
        z.object({
          location: locationInput,
          catalogFilename: z.string().optional(),
        }),
      );
      const schema = z.object({
        location: locationInput,
        catalogFilename: z.string().optional(),
      });
      const output = await locationAnalyzer.analyzeLocation(schema.parse(body));
      res.status(200).json(output);
    });
  }

  if (orchestrator) {
    router.post('/validate-entity', async (req, res) => {
      const bodySchema = z.object({
        entity: z.unknown(),
        location: z.string(),
      });

      let body: z.infer<typeof bodySchema>;
      let entity: Entity;
      let location: { type: string; target: string };
      try {
        body = await validateRequestBody(req, bodySchema);
        entity = validateEntityEnvelope(body.entity);
        location = parseLocationRef(body.location);
        if (location.type !== 'url')
          throw new TypeError(
            `Invalid location ref ${body.location}, only 'url:<target>' is supported, e.g. url:https://host/path`,
          );
      } catch (err) {
        return res.status(400).json({
          errors: [serializeError(err)],
        });
      }

      const processingResult = await orchestrator.process({
        entity: {
          ...entity,
          metadata: {
            ...entity.metadata,
            annotations: {
              [ANNOTATION_LOCATION]: body.location,
              [ANNOTATION_ORIGIN_LOCATION]: body.location,
              ...entity.metadata.annotations,
            },
          },
        },
      });

      if (!processingResult.ok)
        res.status(400).json({
          errors: processingResult.errors.map(e => serializeError(e)),
        });
      return res.status(200).end();
    });
  }

  router.use(errorHandler());
  return router;
}
