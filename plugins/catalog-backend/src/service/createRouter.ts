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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  parseLocationRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError, serializeError } from '@backstage/errors';
import express from 'express';
import yn from 'yn';
import { z } from 'zod';
import { Cursor, EntitiesCatalog } from '../catalog/types';
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
import { LocationService, RefreshService } from './types';
import {
  disallowReadonlyMode,
  encodeCursor,
  locationInput,
  validateRequestBody,
} from './util';
import { createOpenApiRouter } from '../schema/openapi';
import { parseEntityPaginationParams } from './request/parseEntityPaginationParams';
import {
  AuthService,
  HttpAuthService,
  LoggerService,
  SchedulerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { LocationAnalyzer } from '@backstage/plugin-catalog-node';
import { AuthorizedValidationService } from './AuthorizedValidationService';
import {
  createEntityArrayJsonStream,
  writeEntitiesResponse,
  writeSingleEntityResponse,
} from './response';

/**
 * Options used by {@link createRouter}.
 *
 * @public
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 */
export interface RouterOptions {
  entitiesCatalog?: EntitiesCatalog;
  locationAnalyzer?: LocationAnalyzer;
  locationService: LocationService;
  orchestrator?: CatalogProcessingOrchestrator;
  refreshService?: RefreshService;
  scheduler?: SchedulerService;
  logger: LoggerService;
  config: Config;
  permissionIntegrationRouter?: express.Router;
  auth: AuthService;
  httpAuth: HttpAuthService;
  permissionsService: PermissionsService;
  disableRelationsCompatibility?: boolean;
}

/**
 * Creates a catalog router.
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
    permissionsService,
    auth,
    httpAuth,
    disableRelationsCompatibility = false,
  } = options;

  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;
  if (readonlyEnabled) {
    logger.info('Catalog is running in readonly mode');
  }

  if (refreshService) {
    router.post('/refresh', async (req, res) => {
      const { authorizationToken, ...restBody } = req.body;

      const credentials = authorizationToken
        ? await auth.authenticate(authorizationToken)
        : await httpAuth.credentials(req);

      await refreshService.refresh({
        ...restBody,
        credentials,
      });
      res.status(200).end();
    });
  }

  if (permissionIntegrationRouter) {
    router.use(permissionIntegrationRouter);
  }

  if (entitiesCatalog) {
    router
      .get('/entities', async (req, res) => {
        const filter = parseEntityFilterParams(req.query);
        const fields = parseEntityTransformParams(req.query);
        const order = parseEntityOrderParams(req.query);
        const pagination = parseEntityPaginationParams(req.query);
        const credentials = await httpAuth.credentials(req);

        // When pagination parameters are passed in, use the legacy slow path
        // that loads all entities into memory

        if (pagination || disableRelationsCompatibility !== true) {
          const { entities, pageInfo } = await entitiesCatalog.entities({
            filter,
            fields,
            order,
            pagination,
            credentials,
          });

          // Add a Link header to the next page
          if (pageInfo.hasNextPage) {
            const url = new URL(`http://ignored${req.url}`);
            url.searchParams.delete('offset');
            url.searchParams.set('after', pageInfo.endCursor);
            res.setHeader('link', `<${url.pathname}${url.search}>; rel="next"`);
          }

          await writeEntitiesResponse({
            res,
            items: entities,
            alwaysUseObjectMode: !disableRelationsCompatibility,
          });
          return;
        }

        const responseStream = createEntityArrayJsonStream(res);
        const limit = 10000;
        let cursor: Cursor | undefined;

        try {
          let currentWrite: Promise<boolean> | undefined = undefined;
          do {
            const result = await entitiesCatalog.queryEntities(
              !cursor
                ? {
                    credentials,
                    fields,
                    limit,
                    filter,
                    orderFields: order,
                    skipTotalItems: true,
                  }
                : { credentials, fields, limit, cursor },
            );

            // Wait for previous write to complete
            if (await currentWrite) {
              return; // Client closed connection
            }

            if (result.items.entities.length) {
              currentWrite = responseStream.send(result.items);
            }

            cursor = result.pageInfo?.nextCursor;
          } while (cursor);

          // Wait for last write to complete
          await currentWrite;

          responseStream.complete();
        } finally {
          responseStream.close();
        }
      })
      .get('/entities/by-query', async (req, res) => {
        const { items, pageInfo, totalItems } =
          await entitiesCatalog.queryEntities({
            limit: req.query.limit,
            offset: req.query.offset,
            ...parseQueryEntitiesParams(req.query),
            credentials: await httpAuth.credentials(req),
          });

        await writeEntitiesResponse({
          res,
          items,
          alwaysUseObjectMode: !disableRelationsCompatibility,
          responseWrapper: entities => ({
            items: entities,
            totalItems,
            pageInfo: {
              ...(pageInfo.nextCursor && {
                nextCursor: encodeCursor(pageInfo.nextCursor),
              }),
              ...(pageInfo.prevCursor && {
                prevCursor: encodeCursor(pageInfo.prevCursor),
              }),
            },
          }),
        });
      })
      .get('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        const { entities } = await entitiesCatalog.entities({
          filter: basicEntityFilter({ 'metadata.uid': uid }),
          credentials: await httpAuth.credentials(req),
        });
        writeSingleEntityResponse(res, entities, `No entity with uid ${uid}`);
      })
      .delete('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        await entitiesCatalog.removeEntityByUid(uid, {
          credentials: await httpAuth.credentials(req),
        });
        res.status(204).end();
      })
      .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const { items } = await entitiesCatalog.entitiesBatch({
          entityRefs: [stringifyEntityRef({ kind, namespace, name })],
          credentials: await httpAuth.credentials(req),
        });
        writeSingleEntityResponse(
          res,
          items,
          `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
        );
      })
      .get(
        '/entities/by-name/:kind/:namespace/:name/ancestry',
        async (req, res) => {
          const { kind, namespace, name } = req.params;
          const entityRef = stringifyEntityRef({ kind, namespace, name });
          const response = await entitiesCatalog.entityAncestry(entityRef, {
            credentials: await httpAuth.credentials(req),
          });
          res.status(200).json(response);
        },
      )
      .post('/entities/by-refs', async (req, res) => {
        const request = entitiesBatchRequest(req);
        const { items } = await entitiesCatalog.entitiesBatch({
          entityRefs: request.entityRefs,
          filter: parseEntityFilterParams(req.query),
          fields: parseEntityTransformParams(req.query, request.fields),
          credentials: await httpAuth.credentials(req),
        });
        await writeEntitiesResponse({
          res,
          items,
          alwaysUseObjectMode: !disableRelationsCompatibility,
          responseWrapper: entities => ({
            items: entities,
          }),
        });
      })
      .get('/entity-facets', async (req, res) => {
        const response = await entitiesCatalog.facets({
          filter: parseEntityFilterParams(req.query),
          facets: parseEntityFacetParams(req.query),
          credentials: await httpAuth.credentials(req),
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
          credentials: await httpAuth.credentials(req),
        });
        res.status(201).json(output);
      })
      .get('/locations', async (req, res) => {
        const locations = await locationService.listLocations({
          credentials: await httpAuth.credentials(req),
        });
        res.status(200).json(locations.map(l => ({ data: l })));
      })

      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationService.getLocation(id, {
          credentials: await httpAuth.credentials(req),
        });
        res.status(200).json(output);
      })
      .delete('/locations/:id', async (req, res) => {
        disallowReadonlyMode(readonlyEnabled);

        const { id } = req.params;
        await locationService.deleteLocation(id, {
          credentials: await httpAuth.credentials(req),
        });
        res.status(204).end();
      })
      .get('/locations/by-entity/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const output = await locationService.getLocationByEntity(
          { kind, namespace, name },
          { credentials: await httpAuth.credentials(req) },
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
      const credentials = await httpAuth.credentials(req);
      const parsedBody = schema.parse(body);
      try {
        const output = await locationAnalyzer.analyzeLocation(
          parsedBody,
          credentials,
        );
        res.status(200).json(output);
      } catch (err) {
        if (
          // Catch errors from parse-url library.
          err.name === 'Error' &&
          'subject_url' in err
        ) {
          throw new InputError('The given location.target is not a URL');
        }
        throw err;
      }
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

      const credentials = await httpAuth.credentials(req);
      const authorizedValidationService = new AuthorizedValidationService(
        orchestrator,
        permissionsService,
      );
      const processingResult = await authorizedValidationService.process(
        {
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
        },
        credentials,
      );

      if (!processingResult.ok)
        res.status(400).json({
          errors: processingResult.errors.map(e => serializeError(e)),
        });
      return res.status(200).end();
    });
  }

  return router;
}
