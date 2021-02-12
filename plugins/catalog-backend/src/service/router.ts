/*
 * Copyright 2020 Spotify AB
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

import { errorHandler, NotFoundError } from '@backstage/backend-common';
import {
  locationSpecSchema,
  analyzeLocationSchema,
} from '@backstage/catalog-model';
import type { Entity } from '@backstage/catalog-model';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import yn from 'yn';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { LocationAnalyzer, HigherOrderOperation } from '../ingestion/types';
import { translateQueryToFieldMapper } from './filterQuery';
import { EntityFilters } from './EntityFilters';
import { requireRequestBody, validateRequestBody } from './util';

export interface RouterOptions {
  entitiesCatalog?: EntitiesCatalog;
  locationsCatalog?: LocationsCatalog;
  higherOrderOperation?: HigherOrderOperation;
  locationAnalyzer?: LocationAnalyzer;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
  } = options;

  const router = Router();
  router.use(express.json());

  if (entitiesCatalog) {
    router
      .get('/entities', async (req, res) => {
        const filter = EntityFilters.ofQuery(req.query);
        const fieldMapper = translateQueryToFieldMapper(req.query);
        const entities = await entitiesCatalog.entities(filter);
        res.status(200).json(entities.map(fieldMapper));
      })
      .post('/entities', async (req, res) => {
        const body = await requireRequestBody(req);
        const [result] = await entitiesCatalog.batchAddOrUpdateEntities([
          { entity: body as Entity, relations: [] },
        ]);
        const [entity] = await entitiesCatalog.entities(
          EntityFilters.ofMatchers({ 'metadata.uid': result.entityId }),
        );
        res.status(200).json(entity);
      })
      .get('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        const entities = await entitiesCatalog.entities(
          EntityFilters.ofMatchers({ 'metadata.uid': uid }),
        );
        if (!entities.length) {
          throw new NotFoundError(`No entity with uid ${uid}`);
        }
        res.status(200).json(entities[0]);
      })
      .delete('/entities/by-uid/:uid', async (req, res) => {
        const { uid } = req.params;
        await entitiesCatalog.removeEntityByUid(uid);
        res.status(204).end();
      })
      .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
        const { kind, namespace, name } = req.params;
        const entities = await entitiesCatalog.entities(
          EntityFilters.ofMatchers({
            kind: kind,
            'metadata.namespace': namespace,
            'metadata.name': name,
          }),
        );
        if (!entities.length) {
          throw new NotFoundError(
            `No entity with kind ${kind} namespace ${namespace} name ${name}`,
          );
        }
        res.status(200).json(entities[0]);
      });
  }

  if (higherOrderOperation) {
    router.post('/locations', async (req, res) => {
      const input = await validateRequestBody(req, locationSpecSchema);
      const dryRun = yn(req.query.dryRun, { default: false });
      const output = await higherOrderOperation.addLocation(input, { dryRun });
      res.status(201).json(output);
    });
  }

  if (locationsCatalog) {
    router
      .get('/locations', async (_req, res) => {
        const output = await locationsCatalog.locations();
        res.status(200).json(output);
      })
      .get('/locations/:id/history', async (req, res) => {
        const { id } = req.params;
        const output = await locationsCatalog.locationHistory(id);
        res.status(200).json(output);
      })
      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationsCatalog.location(id);
        res.status(200).json(output);
      })
      .delete('/locations/:id', async (req, res) => {
        const { id } = req.params;
        await locationsCatalog.removeLocation(id);
        res.status(204).end();
      });
  }

  if (locationAnalyzer) {
    router.post('/analyze-location', async (req, res) => {
      const input = await validateRequestBody(req, analyzeLocationSchema);
      const output = await locationAnalyzer.analyzeLocation(input);
      res.status(200).json(output);
    });
  }

  router.use(errorHandler());
  return router;
}
