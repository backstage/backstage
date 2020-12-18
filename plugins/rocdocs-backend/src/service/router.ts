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
import { Logger } from 'winston';
import Router from 'express-promise-router';
import express from 'express';
import Knex from 'knex';
import { Config } from '@backstage/config';
import { PluginEndpointDiscovery, UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import fetch from 'cross-fetch';
import { DocsHandler } from './lib/docs-handler';

type RouterOptions = {
  logger: Logger;
  discovery: PluginEndpointDiscovery;
  database?: Knex; // TODO: Make database required when we're implementing database stuff.
  config: Config;
  reader: UrlReader;
};

export async function createRouter({
  discovery,
  reader,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  router.get(
    ['/docs/:namespace/:kind/:name', '/docs/:namespace/:kind/:name/*?'],
    async (req, res) => {
      const { kind, namespace, name, 0: path } = req.params;

      const catalogUrl = await discovery.getBaseUrl('catalog');
      const triple = [kind, namespace, name].map(encodeURIComponent).join('/');

      const catalogRes = await fetch(
        `${catalogUrl}/entities/by-name/${triple}`,
      );
      if (!catalogRes.ok) {
        const catalogResText = await catalogRes.text();
        res.status(catalogRes.status);
        res.send(catalogResText);
        return;
      }

      const entity: Entity = await catalogRes.json();

      const docsHandler = new DocsHandler({ entity, reader });

      res.json(await docsHandler.getDocsResponse(path));
    },
  );

  return router;
}
