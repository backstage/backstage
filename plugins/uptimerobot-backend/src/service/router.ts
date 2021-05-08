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

import { Config } from '@backstage/config';
import { getUptimeRanges, parseAnnotation } from '../utils';
import {
  Group,
  Groups,
  Monitor,
  NormalizedMonitor,
  RouterOptions,
} from '../../types';
import { parseEntityRef } from '@backstage/catalog-model';
import { UPTIMEROBOT_MONITORS_ANNOTATION } from './../../constants';
import express from 'express';
import fetch from 'cross-fetch';
import Router from 'express-promise-router';

function createFetch(
  { apiKey: wantedApiKeyName, monitors = [] }: Group,
  existingApiKeys: Config[],
) {
  const apiKey = existingApiKeys
    .filter(key => key.getString('name') === wantedApiKeyName)[0]
    .getString('key');

  const body: { [key: string]: any } = {
    format: 'json',
    custom_uptime_ratios: '1-7-30',
    custom_uptime_ranges: getUptimeRanges(),
    api_key: apiKey,
  };

  if (monitors.length > 0) body.monitors = monitors.join('-');

  return fetch(`https://api.uptimerobot.com/v2/getMonitors`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function monitorMapper(
  {
    id,
    friendly_name,
    url,
    status,
    custom_uptime_ratio,
    custom_uptime_ranges,
  }: Monitor,
  apiKey: string,
): NormalizedMonitor {
  return {
    id,
    apiKey: apiKey,
    friendlyName: friendly_name,
    url,
    status,
    customUptimeRatio: custom_uptime_ratio.split('-').map(parseFloat),
    customUptimeRanges: custom_uptime_ranges.split('-').map(parseFloat),
  };
}

export async function getMonitors(keys: Groups, fetches: Promise<Response>[]) {
  const monitors = [];
  const responses = await Promise.all(fetches);
  for (let i = 0; i < responses.length; i++) {
    const json = await responses[i].json();
    monitors.push(
      ...json.monitors.map((m: Monitor) => monitorMapper(m, keys[i].apiKey)),
    );
  }
  return monitors;
}

export async function createRouter({
  catalogClient,
  config,
  logger,
}: RouterOptions): Promise<express.Router> {
  logger.info('Initializing UptimeRobot backend.');

  if (!config.getOptionalConfigArray('uptimerobot.apiKeys')?.length) {
    logger.warn(
      'The UptimeRobot plugin was initialized but there are no API keys configured.',
    );
  }

  const router = Router();
  router.use(express.json());

  router.get(
    '/monitors',
    async (req, res): Promise<any> => {
      const existingApiKeys = config.getOptionalConfigArray(
        'uptimerobot.apiKeys',
      );
      if (!existingApiKeys?.length) {
        logger.warn(
          'The UptimeRobot plugin was initialized but there are no API keys configured.',
        );
        return res.send({ monitors: [] });
      }

      let groups: Groups;

      if (req.query.entity) {
        const entityName = parseEntityRef(req.query.entity.toString());
        const entity = await catalogClient.getEntityByName(entityName);

        const annotation =
          entity?.metadata?.annotations?.[UPTIMEROBOT_MONITORS_ANNOTATION];
        if (!annotation) {
          logger.warn(
            `Requested entity not found (requested: ${req.query.entity.toString()}).`,
          );
          return res.send({ monitors: [] });
        }

        groups = parseAnnotation(annotation);
      } else {
        groups = existingApiKeys.map(apiKey => ({
          apiKey: apiKey.getString('name'),
        }));
      }

      const fetches = groups.map(group => createFetch(group, existingApiKeys));
      const monitors = await getMonitors(groups, fetches);

      return res.send({ monitors });
    },
  );

  return router;
}
