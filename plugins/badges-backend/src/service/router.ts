/*
 * Copyright 2021 Spotify AB
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
import fetch from 'cross-fetch';
import Router from 'express-promise-router';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config, JsonObject } from '@backstage/config';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib/BadgeBuilder';
import { BadgeContext, BadgeFactories } from '../types';

export interface RouterOptions {
  badgeBuilder?: BadgeBuilder;
  badgeFactories?: BadgeFactories;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const badgeBuilder =
    options.badgeBuilder ||
    new DefaultBadgeBuilder(options.badgeFactories || {});

  router.get('/entity/:namespace/:kind/:name/badge-specs', async (req, res) => {
    const entityUri = getEntityUri(req.params);
    const entity = await getEntity(options.discovery, entityUri);
    if (!entity) {
      res.status(404).send(`Unknown entity`);
      return;
    }

    const context: BadgeContext = {
      badgeUrl: '',
      config: options.config,
      entity,
    };

    const specs = [];
    for (const badgeId of await badgeBuilder.getBadgeIds()) {
      context.badgeUrl = [
        `${req.protocol}://`,
        req.headers.host,
        req.originalUrl.replace(/badge-specs$/, badgeId),
      ].join('');
      const badge = await badgeBuilder.createBadge({
        badgeId,
        context,
        format: 'json',
      });

      if (badge) {
        specs.push(badge);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(`[${specs.join(',\n')}]`);
  });

  router.get('/entity/:namespace/:kind/:name/:badgeId', async (req, res) => {
    const { badgeId } = req.params;

    const entityUri = getEntityUri(req.params);
    const entity = await getEntity(options.discovery, entityUri);
    if (!entity) {
      res.status(404).send(`Unknown entity`);
      return;
    }

    let format =
      req.accepts(['image/svg+xml', 'application/json']) || 'image/svg+xml';
    if (req.query.format === 'json') {
      format = 'application/json';
    }

    const badgeUrl = [
      `${req.protocol}://`,
      req.headers.host,
      req.originalUrl,
    ].join('');

    const data = await badgeBuilder.createBadge({
      badgeId,
      context: { badgeUrl, config: options.config, entity },
      format: format === 'application/json' ? 'json' : 'svg',
    });

    if (!data) {
      res.status(404).send(`Unknown entity badge "${badgeId}"`);
    } else {
      res.setHeader('Content-Type', format);
      res.status(200).send(data);
    }
  });

  router.use(errorHandler());

  return router;
}

function getEntityUri(params: JsonObject): string {
  const { kind, namespace, name } = params;
  return `${kind}/${namespace}/${name}`;
}

async function getEntity(
  discovery: PluginEndpointDiscovery,
  entityUri: string,
): Promise<Entity> {
  const catalogUrl = await discovery.getBaseUrl('catalog');

  const entity = (await (
    await fetch(`${catalogUrl}/entities/by-name/${entityUri}`)
  ).json()) as Entity;

  return entity;
}
