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

import { errorHandler, useHotCleanup } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import fetch from 'node-fetch';

const router = Router();
const API_URL = 'https://api.pagerduty.com';
const EVENTS_API_URL = 'https://events.pagerduty.com/v2';

type Options = {
  method: string;
  headers: {
    'Content-Type': string;
    Accept: string;
    Authorization?: string;
  };
  body?: string;
};

async function request(
  url: string,
  options: any, // Options,
): Promise<Response | Error> {
  // TODO: handle errors better
  const response = await fetch(url, options);

  if (!response.ok) {
    const payload = await response.json();
    const errors = payload.errors.map((error: string) => error).join(' ');
    const message = `Request failed with ${response.status}, ${errors}`;

    throw new Error(message);
  }

  return await response.json();
}

async function services(token?: string) {
  // TODO: handle missing token differently
  if (!token) {
    return 'Missing Token';
  }
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
      'Content-Type': 'application/json',
    },
  };
  let offset = 0;
  // TODO: Create type for this data
  const data: any = [];

  async function fetchData() {
    const result: any = await request(
      `${API_URL}/services?offset=${offset}`,
      options,
    );
    data.push(...result.services);

    // TODO: remove offset when we are done
    if (offset < 4 && result.more) {
      ++offset;
      await fetchData();
    }
  }

  await fetchData();
  return data;
}

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const token = config.getOptionalString('pagerduty.api_token') ?? undefined;

  let cachedData: any = [];

  let cancel = false;
  const intervalId = setInterval(async () => {
    if (!cancel) {
      cancel = true;
      const result = await services(token);
      cachedData = result;
      cancel = false;
    }
  }, 10000);

  useHotCleanup(module, () => clearInterval(intervalId));

  router.use(express.json());

  router.get('/services', async (_, response) => {
    logger.info('pinged');

    response.send({ services: cachedData, size: cachedData.length });
  });

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
