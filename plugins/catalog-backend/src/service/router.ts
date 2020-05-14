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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { addLocationSchema, ItemsCatalog, LocationsCatalog } from '../catalog';
import { validateRequestBody } from './util';

export interface RouterOptions {
  itemsCatalog?: ItemsCatalog;
  locationsCatalog?: LocationsCatalog;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { itemsCatalog, locationsCatalog } = options;
  const logger = options.logger.child({ plugin: 'catalog' });
  const router = Router();

  if (itemsCatalog) {
    // Components
    router
      .get('/components', async (req, res) => {
        const components = await itemsCatalog.components();
        res.status(200).send(components);
      })
      .get('/components/:id', async (req, res) => {
        const { id } = req.params;
        const component = await itemsCatalog.component(id);
        res.status(200).send(component);
      });
  }

  // Locations
  if (locationsCatalog) {
    router
      .post('/locations', async (req, res) => {
        const input = await validateRequestBody(req, addLocationSchema);
        const output = await locationsCatalog.addLocation(input);
        res.status(201).send(output);
      })
      .get('/locations', async (req, res) => {
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

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
