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
  AuditorService,
  AuthService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  parseLocationRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError, NotFoundError, serializeError } from '@backstage/errors';
import { LocationAnalyzer } from '@backstage/plugin-catalog-node';
import express from 'express';
import yn from 'yn';
import { z } from 'zod';
import { EntitiesCatalog } from '../catalog/types';
import { CatalogProcessingOrchestrator } from '../processing/types';
import { validateEntityEnvelope } from '../processing/util';
import { createOpenApiRouter } from '../schema/openapi';
import { AuthorizedValidationService } from './AuthorizedValidationService';
import {
  basicEntityFilter,
  entitiesBatchRequest,
  parseEntityFilterParams,
  parseEntityTransformParams,
  parseQueryEntitiesParams,
} from './request';
import { parseEntityFacetParams } from './request/parseEntityFacetParams';
import { parseEntityOrderParams } from './request/parseEntityOrderParams';
import { parseEntityPaginationParams } from './request/parseEntityPaginationParams';
import { LocationService, RefreshService } from './types';
import {
  disallowReadonlyMode,
  encodeCursor,
  locationInput,
  validateRequestBody,
} from './util';

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
  // TODO: Require AuditorService once `backend-legacy` is removed
  auditor?: AuditorService;
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
    auditor,
  } = options;

  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;
  if (readonlyEnabled) {
    logger.info('Catalog is running in readonly mode');
  }

  if (refreshService) {
    // TODO: Potentially find a way to track the ancestor that gets refreshed to refresh this entity (as well as the child of that ancestor?)
    router.post('/refresh', async (req, res) => {
      const { authorizationToken, ...restBody } = req.body;

      const auditorEvent = await auditor?.createEvent({
        eventId: 'entity-mutate',
        subEventId: 'refresh',
        severityLevel: 'medium',
        meta: {
          entityRef: restBody.entityRef,
        },
        request: req,
      });

      try {
        const credentials = authorizationToken
          ? await auth.authenticate(authorizationToken)
          : await httpAuth.credentials(req);

        await refreshService.refresh({
          ...restBody,
          credentials,
        });

        await auditorEvent?.success();
        res.status(200).end();
      } catch (err) {
        await auditorEvent?.fail({ error: err });
        throw err;
      }
    });
  }

  if (permissionIntegrationRouter) {
    router.use(permissionIntegrationRouter);
  }

  if (entitiesCatalog) {
    router
      .get('/entities', async (req, res) => {
        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-fetch',
          subEventId: 'all',
          request: req,
        });

        try {
          const { entities, pageInfo } = await entitiesCatalog.entities({
            filter: parseEntityFilterParams(req.query),
            fields: parseEntityTransformParams(req.query),
            order: parseEntityOrderParams(req.query),
            pagination: parseEntityPaginationParams(req.query),
            credentials: await httpAuth.credentials(req),
          });

          // Add a Link header to the next page
          if (pageInfo.hasNextPage) {
            const url = new URL(`http://ignored${req.url}`);
            url.searchParams.delete('offset');
            url.searchParams.set('after', pageInfo.endCursor);
            res.setHeader('link', `<${url.pathname}${url.search}>; rel="next"`);
          }

          // Let's not log out the entities since this can make the log very big due to it not being paged
          await auditorEvent?.success();

          // TODO(freben): encode the pageInfo in the response
          res.json(entities);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get('/entities/by-query', async (req, res) => {
        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-fetch',
          subEventId: 'by-query',
          request: req,
        });

        try {
          const { items, pageInfo, totalItems } =
            await entitiesCatalog.queryEntities({
              limit: req.query.limit,
              offset: req.query.offset,
              ...parseQueryEntitiesParams(req.query),
              credentials: await httpAuth.credentials(req),
            });

          await auditorEvent?.success({
            // Let's not log out the entities since this can make the log very big
            meta: {
              totalEntities: totalItems,
              pageInfo: {
                ...(pageInfo.nextCursor && {
                  nextCursor: encodeCursor(pageInfo.nextCursor),
                }),
                ...(pageInfo.prevCursor && {
                  prevCursor: encodeCursor(pageInfo.prevCursor),
                }),
              },
            },
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
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;

        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-fetch',
          subEventId: 'by-uid',
          request: req,
          meta: {
            uid: uid,
          },
        });

        try {
          const { entities } = await entitiesCatalog.entities({
            filter: basicEntityFilter({ 'metadata.uid': uid }),
            credentials: await httpAuth.credentials(req),
          });
          if (!entities.length) {
            throw new NotFoundError(`No entity with uid ${uid}`);
          }

          await auditorEvent?.success({
            meta: {
              entityRef: entities.map(stringifyEntityRef).at(0),
            },
          });

          res.status(200).json(entities.at(0));
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .delete('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;

        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-mutate',
          subEventId: 'delete',
          severityLevel: 'medium',
          request: req,
          meta: {
            uid: uid,
          },
        });

        try {
          await entitiesCatalog.removeEntityByUid(uid, {
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success();

          res.status(204).end();
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const entityRef = stringifyEntityRef({ kind, namespace, name });

        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-fetch',
          subEventId: 'by-name',
          request: req,
          meta: {
            entityRef: entityRef,
          },
        });

        try {
          const { entities } = await entitiesCatalog.entities({
            filter: basicEntityFilter({
              kind: kind,
              'metadata.namespace': namespace,
              'metadata.name': name,
            }),
            credentials: await httpAuth.credentials(req),
          });
          if (!entities.length) {
            throw new NotFoundError(
              `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
            );
          }

          await auditorEvent?.success();

          res.status(200).json(entities.at(0));
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get(
        '/entities/by-name/:kind/:namespace/:name/ancestry',
        async (req, res) => {
          const { kind, namespace, name } = req.params;
          const entityRef = stringifyEntityRef({ kind, namespace, name });

          const auditorEvent = await auditor?.createEvent({
            eventId: 'entity-fetch',
            subEventId: 'ancestry',
            request: req,
            meta: {
              entityRef: entityRef,
            },
          });

          try {
            const response = await entitiesCatalog.entityAncestry(entityRef, {
              credentials: await httpAuth.credentials(req),
            });

            await auditorEvent?.success({
              meta: {
                rootEntityRef: response.rootEntityRef,
                ancestry: response.items.map(ancestryLink => {
                  return {
                    entityRef: stringifyEntityRef(ancestryLink.entity),
                    parentEntityRefs: ancestryLink.parentEntityRefs,
                  };
                }),
              },
            });

            res.status(200).json(response);
          } catch (err) {
            await auditorEvent?.fail({
              error: err,
            });
            throw err;
          }
        },
      )
      .post('/entities/by-refs', async (req, res) => {
        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-fetch',
          subEventId: 'by-refs',
          request: req,
        });

        try {
          const request = entitiesBatchRequest(req);
          const response = await entitiesCatalog.entitiesBatch({
            entityRefs: request.entityRefs,
            filter: parseEntityFilterParams(req.query),
            fields: parseEntityTransformParams(req.query, request.fields),
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success({
            meta: {
              ...request,
            },
          });

          res.status(200).json(response);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get('/entity-facets', async (req, res) => {
        const auditorEvent = await auditor?.createEvent({
          eventId: 'entity-facets',
          request: req,
        });

        try {
          const response = await entitiesCatalog.facets({
            filter: parseEntityFilterParams(req.query),
            facets: parseEntityFacetParams(req.query),
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success();

          res.status(200).json(response);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      });
  }

  if (locationService) {
    router
      .post('/locations', async (req, res) => {
        const location = await validateRequestBody(req, locationInput);
        const dryRun = yn(req.query.dryRun, { default: false });

        const auditorEvent = await auditor?.createEvent({
          eventId: 'location-mutate',
          subEventId: 'create',
          severityLevel: dryRun ? 'low' : 'medium',
          request: req,
          meta: {
            location: location,
            isDryRun: dryRun,
          },
        });

        try {
          // when in dryRun addLocation is effectively a read operation so we don't
          // need to disallow readonly
          if (!dryRun) {
            disallowReadonlyMode(readonlyEnabled);
          }

          const output = await locationService.createLocation(
            location,
            dryRun,
            {
              credentials: await httpAuth.credentials(req),
            },
          );

          await auditorEvent?.success({
            meta: {
              location: output.location,
            },
          });

          res.status(201).json(output);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
            meta: {
              location: location,
              isDryRun: dryRun,
            },
          });
          throw err;
        }
      })
      .get('/locations', async (req, res) => {
        const auditorEvent = await auditor?.createEvent({
          eventId: 'location-fetch',
          subEventId: 'all',
          request: req,
        });

        try {
          const locations = await locationService.listLocations({
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success();

          res.status(200).json(locations.map(l => ({ data: l })));
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })

      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;

        const auditorEvent = await auditor?.createEvent({
          eventId: 'location-fetch',
          subEventId: 'by-id',
          request: req,
          meta: {
            id: id,
          },
        });

        try {
          const output = await locationService.getLocation(id, {
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success({
            meta: {
              output: output,
            },
          });

          res.status(200).json(output);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .delete('/locations/:id', async (req, res) => {
        const { id } = req.params;

        const auditorEvent = await auditor?.createEvent({
          eventId: 'location-mutate',
          subEventId: 'delete',
          severityLevel: 'medium',
          request: req,
          meta: {
            id: id,
          },
        });

        disallowReadonlyMode(readonlyEnabled);

        try {
          await locationService.deleteLocation(id, {
            credentials: await httpAuth.credentials(req),
          });

          await auditorEvent?.success();

          res.status(204).end();
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      })
      .get('/locations/by-entity/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const locationRef = `${kind}:${namespace}/${name}`;

        const auditorEvent = await auditor?.createEvent({
          eventId: 'location-fetch',
          subEventId: 'by-entity',
          request: req,
          meta: {
            locationRef: locationRef,
          },
        });

        try {
          const output = await locationService.getLocationByEntity(
            { kind, namespace, name },
            { credentials: await httpAuth.credentials(req) },
          );

          await auditorEvent?.success({
            meta: {
              output: output,
            },
          });

          res.status(200).json(output);
        } catch (err) {
          await auditorEvent?.fail({
            error: err,
          });
          throw err;
        }
      });
  }

  if (locationAnalyzer) {
    router.post('/analyze-location', async (req, res) => {
      const auditorEvent = await auditor?.createEvent({
        eventId: 'location-analyze',
        request: req,
      });

      try {
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

          await auditorEvent?.success({
            meta: {
              output: output,
            },
          });

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
      } catch (err) {
        await auditorEvent?.fail({
          error: err,
        });
        throw err;
      }
    });
  }

  if (orchestrator) {
    router.post('/validate-entity', async (req, res) => {
      const auditorEvent = await auditor?.createEvent({
        eventId: 'entity-validate',
        request: req,
      });

      try {
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
          await auditorEvent?.fail({
            error: err,
          });

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

        if (!processingResult.ok) {
          const errors = processingResult.errors.map(e => serializeError(e));

          await auditorEvent?.fail({
            errors: errors,
          });

          res.status(400).json({
            errors,
          });
        }

        await auditorEvent?.success();

        return res.status(200).end();
      } catch (err) {
        await auditorEvent?.fail({
          error: err,
        });
        throw err;
      }
    });
  }

  router.use(errorHandler());
  return router;
}
