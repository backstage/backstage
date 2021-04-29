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
import { getUptimeRanges } from '../utils';
import { Monitor, NormalizedMonitor, RouterOptions } from '../../types';
import express from 'express';
import fetch from 'cross-fetch';
import Router from 'express-promise-router';

export function parseAnnotation(rawAnnotation: string) {
  const splittedAnnotation = rawAnnotation.split(';');
  return splittedAnnotation.map(part => {
    const a = part.split(',');
    return {
      apiKey: a[0].replace('apiKey=', ''),
      monitors: a[1].replace('monitors=', '').split('+'),
    };
  });
}

function createFetch(
  {
    apiKey: wantedApiKeyName,
    monitors = [],
  }: { apiKey: string; monitors?: string[] },
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

export async function createRouter({
  config,
  logger,
}: RouterOptions): Promise<express.Router> {
  logger.info('Initializing UptimeRobot backend.');

  if (config.getConfigArray('uptimerobot.apiKeys').length === 0) {
    logger.warn('No API keys configured.');
  }

  const router = Router();
  router.use(express.json());

  router.get(
    '/monitors',
    async (_, res): Promise<any> => {
      const existingApiKeys = config.getConfigArray('uptimerobot.apiKeys');
      if (existingApiKeys.length === 0) {
        logger.warn(
          'The UptimeRobot plugin was initialized but there are no API keys configured.',
        );
        return res.send({ monitors: [] });
      }

      const fetches = existingApiKeys.map(apiKey =>
        createFetch({ apiKey: apiKey.getString('name') }, existingApiKeys),
      );

      const monitors = [];
      const responses = await Promise.all(fetches);
      for (let i = 0; i < responses.length; i++) {
        const json = await responses[i].json();
        monitors.push(
          ...json.monitors.map((m: Monitor) =>
            monitorMapper(m, existingApiKeys[i].getString('name')),
          ),
        );
      }

      return res.send({ monitors });
    },
  );

  router.get(
    '/monitors/:annotation',
    async (req, res): Promise<any> => {
      const existingApiKeys = config.getConfigArray('uptimerobot.apiKeys');
      if (existingApiKeys.length === 0) {
        logger.warn(
          'The UptimeRobot plugin was initialized but there are no API keys configured.',
        );
        return res.send({ monitors: [] });
      }

      const annotation = parseAnnotation(req.params.annotation);
      const fetches = annotation.map(a => createFetch(a, existingApiKeys));

      const monitors = [];
      const responses = await Promise.all(fetches);
      for (let i = 0; i < responses.length; i++) {
        const json = await responses[i].json();
        monitors.push(
          ...json.monitors.map((m: Monitor) =>
            monitorMapper(m, annotation[i].apiKey),
          ),
        );
      }

      return res.send({ monitors });
    },
  );

  return router;
}
