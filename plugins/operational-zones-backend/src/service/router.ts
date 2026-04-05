/*
 * Copyright 2024 The Backstage Authors
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
import { z } from 'zod/v3';
import { InputError } from '@backstage/errors';
import { HttpAuthService } from '@backstage/backend-plugin-api';
import {
  OperationalZoneService,
  ZoneLevel,
} from '@backstage/plugin-operational-zones-common';

/** @public */
export async function createRouter(options: {
  httpAuth: HttpAuthService;
  service: OperationalZoneService;
}): Promise<express.Router> {
  const { httpAuth, service } = options;
  const router = Router();
  router.use(express.json());

  const createZoneSchema = z.object({
    operationId: z.string().min(1),
    defaultLevel: z.enum(['green', 'yellow', 'red']).optional(),
    windows: z
      .array(
        z.object({
          level: z.enum(['green', 'yellow', 'red']),
          cron: z.string().min(9),
          durationMinutes: z.number().int().positive(),
        }),
      )
      .min(1),
  });

  router.get('/zones', async (_req, res) => {
    const zones = await service.listAll();
    res.json({ zones });
  });

  router.get('/zones/:operationId', async (req, res) => {
    const { operationId } = req.params;
    const zone = await service.resolve(operationId);
    res.json(zone);
  });

  router.post('/zones', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });

    const parsed = createZoneSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(`Invalid request body: ${parsed.error.message}`);
    }

    const { operationId, defaultLevel, windows } = parsed.data;
    service.register(operationId, {
      operationId,
      defaultLevel: defaultLevel as ZoneLevel | undefined,
      windows: windows.map(w => ({
        ...w,
        level: w.level as ZoneLevel,
      })),
    });

    const zone = await service.resolve(operationId);
    res.status(201).json(zone);
  });

  return router;
}
