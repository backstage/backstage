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

import { InputError } from '@backstage/backend-common';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import yup from 'yup';
import { addLocationRequestShape, Inventory } from '../inventory';

export interface RouterOptions {
  inventory: Inventory;
  logger: Logger;
}

async function validateRequestBody<T>(
  req: Request,
  schema: yup.Schema<T>,
): Promise<T> {
  const contentType = req.header('content-type');
  if (!contentType) {
    throw new InputError('Content-Type missing');
  } else if (!contentType.match(/^application\/json($|;)/)) {
    throw new InputError('Illegal Content-Type');
  }

  const body = req.body;
  if (!body) {
    throw new InputError('Missing request body');
  }

  try {
    await schema.validate(body, { strict: true });
  } catch (e) {
    throw new InputError(`Malformed request: ${e}`);
  }

  return body as T;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const inventory = options.inventory;
  const logger = options.logger.child({ plugin: 'inventory' });
  const router = Router();

  // Components
  router
    .get('/components', async (req, res) => {
      const components = await inventory.components();
      res.status(200).send(components);
    })
    .get('/components/:id', async (req, res) => {
      const { id } = req.params;
      const component = await inventory.component(id);
      res.status(200).send(component);
    });

  // Locations
  router
    .post('/locations', async (req, res) => {
      const input = await validateRequestBody(req, addLocationRequestShape);
      const output = await inventory.addLocation(input);
      res.status(201).send(output);
    })
    .get('/locations', async (req, res) => {
      const output = await inventory.locations();
      res.status(200).send(output);
    })
    .get('/locations/:id', async (req, res) => {
      const { id } = req.params;
      const output = await inventory.location(id);
      res.status(200).send(output);
    })
    .delete('/locations/:id', async (req, res) => {
      const { id } = req.params;
      await inventory.removeLocation(id);
      res.status(200).send();
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
