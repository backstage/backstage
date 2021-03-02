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
import { Logger } from 'winston';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config, JsonObject } from '@backstage/config';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib/BadgeBuilder';
import { Badge, BadgeStyle, BADGE_STYLES } from '../types';

export interface RouterOptions {
  badgeBuilder?: BadgeBuilder;
  badges?: Badge[];
  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const logger = options.logger.child({ plugin: 'badges' });
  const title = options.config.getString('app.title') || 'Backstage';
  const catalogUrl = `${options.config.getString('app.baseUrl')}/catalog`;
  const badgeBuilder =
    options.badgeBuilder ||
    new DefaultBadgeBuilder(logger, options.badges || []);

  router.get('/entity/:namespace/:kind/:name/badge-specs', async (req, res) => {
    const entityUri = getEntityUri(req.params);
    const entity_url = `${catalogUrl}/${entityUri}`;
    const entity = await getEntity(options.discovery, entityUri);
    if (!entity) {
      res.status(404).send(`Unknown entity`);
      return;
    }

    const context = {
      app: { title },
      badge_url: '',
      entity,
      entity_url,
    };

    const specs = [];
    for (const badge of await badgeBuilder.getAllBadgeConfigs()) {
      if (!badge.kind || badge.kind === 'entity') {
        badge.link = badge.link ?? '_{entity_url}';
        context.badge_url = [
          `${req.protocol}://`,
          req.headers.host,
          req.originalUrl.replace(/badge-specs$/, badge.id!),
        ].join('');
        specs.push(
          await badgeBuilder.createBadge({
            config: badge,
            context,
            format: 'json',
          }),
        );
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(`[${specs.join(',\n')}]`);
  });

  router.get('/entity/:namespace/:kind/:name/:badgeId', async (req, res) => {
    const { badgeId } = req.params;
    let badge = await badgeBuilder.getBadgeConfig(badgeId);
    if (badge.kind && badge.kind !== 'entity') {
      badge = {
        label: 'Badge kind error',
        message: `${badgeId} is for ${badge.kind} not entity`,
        color: 'red',
      };
    }

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

    if (BADGE_STYLES.includes(req.query.style as BadgeStyle)) {
      badge.style = req.query.style as BadgeStyle;
    }

    const badge_url = [
      `${req.protocol}://`,
      req.headers.host,
      req.originalUrl,
    ].join('');
    const entity_url = `${catalogUrl}/${entityUri}`;
    badge.link = badge.link ?? '_{entity_url}';

    const data = await badgeBuilder.createBadge({
      config: badge,
      context: {
        app: { title },
        badge_url,
        entity,
        entity_url,
      },
      format: format === 'application/json' ? 'json' : 'svg',
    });

    res.setHeader('Content-Type', format);
    res.status(200).send(data);
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
