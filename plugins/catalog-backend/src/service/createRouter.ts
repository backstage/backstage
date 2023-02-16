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
import { InputError, NotFoundError, serializeError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
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
  parseEntityPaginationParams,
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
import { initialize } from 'express-openapi';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

class ParsingError extends Error {
  toString() {
    return `ParsingError: ${this.message}`;
  }
}

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
  const router = Router();
  router.use(express.json());

  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;
  if (readonlyEnabled) {
    logger.info('Catalog is running in readonly mode');
  }

  const validateDependency = (
    dependency: any,
    next: (req: express.Request, res: express.Response) => any,
  ) => {
    return (req: express.Request, res: express.Response) => {
      if (!dependency) {
        console.log('no dependency');
        throw new NotFoundError(
          'Dependency Error',
          'Dependency not set up for this endpoint.',
        );
      }
      return next(req, res);
    };
  };

  initialize({
    app: router as any,
    // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
    // apiDoc: './api-v1/api-doc.yml',
    apiDoc: yaml.load(
      // eslint-disable-next-line no-restricted-syntax
      fs.readFileSync(path.resolve(__dirname, '../../openapi.yaml'), 'utf-8'),
    ) as any,
    operations: {
      RefreshEntity: validateDependency(refreshService, async (req, res) => {
        const refreshOptions: RefreshOptions = req.body;
        refreshOptions.authorizationToken = getBearerToken(
          req.header('authorization'),
        );

        await refreshService!.refresh(refreshOptions);
        res.status(200).end();
      }),
      GetEntities: validateDependency(entitiesCatalog, async (req, res) => {
        const { entities, pageInfo } = await entitiesCatalog!.entities({
          filter: parseEntityFilterParams(req.query),
          fields: parseEntityTransformParams(req.query),
          order: parseEntityOrderParams(req.query),
          pagination: parseEntityPaginationParams(req.query),
          authorizationToken: getBearerToken(req.header('authorization')),
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
      }),
      GetEntityByUid: validateDependency(entitiesCatalog, async (req, res) => {
        const { uid } = req.params;
        const { entities } = await entitiesCatalog!.entities({
          filter: basicEntityFilter({ 'metadata.uid': uid }),
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        if (!entities.length) {
          throw new NotFoundError(`No entity with uid ${uid}`);
        }
        res.status(200).json(entities[0]);
      }),
      GetEntityByName: validateDependency(entitiesCatalog, async (req, res) => {
        const { kind, namespace, name } = req.params;
        const { entities } = await entitiesCatalog!.entities({
          filter: basicEntityFilter({
            kind: kind,
            'metadata.namespace': namespace,
            'metadata.name': name,
          }),
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        if (!entities.length) {
          throw new NotFoundError(
            `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
          );
        }
        res.status(200).json(entities[0]);
      }),
      GetEntityAncestryByName: validateDependency(
        entitiesCatalog,
        async (req, res) => {
          const { kind, namespace, name } = req.params;
          const entityRef = stringifyEntityRef({ kind, namespace, name });
          const response = await entitiesCatalog!.entityAncestry(entityRef, {
            authorizationToken: getBearerToken(req.header('authorization')),
          });
          res.status(200).json(response);
        },
      ),
      GetEntityFacets: validateDependency(entitiesCatalog, async (req, res) => {
        const response = await entitiesCatalog!.facets({
          filter: parseEntityFilterParams(req.query),
          facets: parseEntityFacetParams(req.query),
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        res.status(200).json(response);
      }),
      CreateLocation: validateDependency(locationService, async (req, res) => {
        const location = await validateRequestBody(req, locationInput);
        const dryRun = yn(req.query.dryRun, { default: false });

        // when in dryRun addLocation is effectively a read operation so we don't
        // need to disallow readonly
        if (!dryRun) {
          disallowReadonlyMode(readonlyEnabled);
        }

        const output = await locationService.createLocation(location, dryRun, {
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        res.status(201).json(output);
      }),
      GetLocations: validateDependency(locationService, async (req, res) => {
        const locations = await locationService.listLocations({
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        res.status(200).json(locations.map(l => ({ data: l })));
      }),
      GetLocation: validateDependency(locationService, async (req, res) => {
        const { id } = req.params;
        const output = await locationService.getLocation(id, {
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        res.status(200).json(output);
      }),
      DeleteLocation: validateDependency(locationService, async (req, res) => {
        disallowReadonlyMode(readonlyEnabled);

        const { id } = req.params;
        await locationService.deleteLocation(id, {
          authorizationToken: getBearerToken(req.header('authorization')),
        });
        res.status(204).end();
      }),
      AnalyzeLocation: validateDependency(locationService, async (req, res) => {
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
        const output = await locationAnalyzer!.analyzeLocation(
          schema.parse(body),
        );
        res.status(200).json(output);
      }),
      ValidateEntity: validateDependency(orchestrator, async (req, res) => {
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

        const processingResult = await orchestrator!.process({
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
      }),
      DeleteEntityByUid: validateDependency(
        entitiesCatalog,
        async (req, res) => {
          const { uid } = req.params;
          await entitiesCatalog!.removeEntityByUid(uid, {
            authorizationToken: getBearerToken(req.header('authorization')),
          });
          res.status(204).end();
        },
      ),
      GetEntitiesByRefs: validateDependency(
        entitiesCatalog,
        async (req, res) => {
          const request = entitiesBatchRequest(req);
          const token = getBearerToken(req.header('authorization'));
          const response = await entitiesCatalog!.entitiesBatch({
            entityRefs: request.entityRefs,
            fields: parseEntityTransformParams(req.query, request.fields),
            authorizationToken: token,
          });
          res.status(200).json(response);
        },
      ),
    },
    enableObjectCoercion: true,
    errorMiddleware: errorHandler(),
    errorTransformer: openapiError => {
      const error = openapiError as {
        errorCode: string;
        path: string;
        message: string;
      };
      // eslint-disable-next-line default-case
      switch (error.errorCode) {
        case 'type.openapi.requestValidation':
          throw new InputError(
            `Invalid field ${error.path}`,
            new ParsingError(error.message),
          );
      }
      return {};
    },
  });

  if (permissionIntegrationRouter) {
    router.use(permissionIntegrationRouter);
  }
  return router;
}

function getBearerToken(
  authorizationHeader: string | undefined,
): string | undefined {
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }
  const matches = authorizationHeader.match(/Bearer\s+(\S+)/i);
  return matches?.[1];
}
