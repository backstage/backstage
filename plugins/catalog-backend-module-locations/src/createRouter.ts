/*
 * Copyright 2020 The Backstage Authors
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
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import yn from 'yn';
import { LocationsRegistryService } from './service/types';
import {
  disallowReadonlyMode,
  locationInput,
  validateRequestBody,
} from './util';

/**
 * Creates a catalog router.
 *
 * @public
 */
export async function createRouter(options: {
  service: LocationsRegistryService;
  config: Config;
}): Promise<express.Router> {
  const { service, config } = options;
  const readonlyEnabled =
    config.getOptionalBoolean('catalog.readonly') || false;

  const router = Router();
  router.use(express.json());

  router.post('/locations', async (req, res) => {
    const location = await validateRequestBody(req, locationInput);
    const dryRun = yn(req.query.dryRun, { default: false });

    // when in dryRun addLocation is effectively a read operation so we don't
    // need to disallow readonly
    if (!dryRun) {
      disallowReadonlyMode(readonlyEnabled);
    }

    const output = await service.createLocation(location, dryRun, {
      authorizationToken: getBearerToken(req),
    });
    res.status(201).json(output);
  });

  router.get('/locations', async (req, res) => {
    const locations = await service.listLocations({
      authorizationToken: getBearerToken(req),
    });
    res.status(200).json(locations.map(l => ({ data: l })));
  });

  router.get('/locations/:id', async (req, res) => {
    const { id } = req.params;
    const output = await service.getLocation(id, {
      authorizationToken: getBearerToken(req),
    });
    res.status(200).json(output);
  });

  router.delete('/locations/:id', async (req, res) => {
    disallowReadonlyMode(readonlyEnabled);

    const { id } = req.params;
    await service.deleteLocation(id, {
      authorizationToken: getBearerToken(req),
    });
    res.status(204).end();
  });

  router.use(errorHandler());
  return router;
}

function getBearerToken(req: express.Request): string | undefined {
  const authorizationHeader = req.header('authorization');
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }

  const matches = authorizationHeader.match(/Bearer\s+(\S+)/i);
  return matches?.[1];
}
