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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  addLocationSchema,
  EntitiesCatalog,
  EntityFilters,
  LocationsCatalog,
} from '../catalog';
import { validateRequestBody } from './util';

export interface RouterOptions {
  entitiesCatalog?: EntitiesCatalog;
  locationsCatalog?: LocationsCatalog;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { entitiesCatalog, locationsCatalog } = options;

  const router = Router();
  router.use(express.json());

  if (entitiesCatalog) {
    router.get('/entities', async (req, res) => {
      const filters: EntityFilters = [];
      for (const [key, valueOrValues] of Object.entries(req.query)) {
        const values = Array.isArray(valueOrValues)
          ? valueOrValues
          : [valueOrValues];
        if (values.some(v => typeof v !== 'string')) {
          res.status(400).send('Complex query parameters are not supported');
          return;
        }
        filters.push({
          key,
          values: values.map(v => v || null) as string[],
        });
      }

      const entities = await entitiesCatalog.entities(filters);

      res.status(200).send(entities);
    });
  }

  if (locationsCatalog) {
    router
      .post('/locations', async (req, res) => {
        const input = await validateRequestBody(req, addLocationSchema);
        const output = await locationsCatalog.addLocation(input);
        res.status(201).send(output);
      })
      .get('/locations', async (_req, res) => {
        const output = await locationsCatalog.locations();
        res.status(200).send(output);
      })
      .get('/locations/:id', async (req, res) => {
        const { id } = req.params;
        const output = await locationsCatalog.location(id);
        res.status(200).send(output);
      })
      .delete('/locations/:id', async (req, res) => {
        const { id } = req.params;
        await locationsCatalog.removeLocation(id);
        res.status(200).send();
      });
  }

  router.use(errorHandler());
  return router;
}
