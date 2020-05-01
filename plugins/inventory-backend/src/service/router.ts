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
import { Logger } from 'winston';
import { AggregatorInventory, StaticInventory } from '../inventory';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger.child({ plugin: 'inventory' });

  const inventory = new AggregatorInventory();
  inventory.enlist(
    new StaticInventory([
      { id: 'component1' },
      { id: 'component2' },
      { id: 'component3' },
      { id: 'component4' },
    ]),
  );

  const router = express.Router();
  router
    .get('/', async (req, res) => {
      const components = await inventory.list();
      res.status(200).send(components);
    })
    .get('/:id', async (req, res) => {
      const { id } = req.params;
      const component = await inventory.item(id);
      if (component) {
        res.status(200).send(component);
      } else {
        res.status(404).send();
      }
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
