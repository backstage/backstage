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

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { RootLifecycleService } from '@backstage/backend-plugin-api';

export function createHealthRouter(options: {
  lifecycle: RootLifecycleService;
}) {
  const router = Router();

  let isRunning = false;
  options.lifecycle.addStartupHook(() => {
    isRunning = true;
  });
  options.lifecycle.addShutdownHook(() => {
    isRunning = false;
  });

  router.get('/v1/readiness', async (_request: Request, response: Response) => {
    if (!isRunning) {
      throw new Error('Backend has not started yet');
    }
    response.json({ status: 'ok' });
  });

  router.get('/v1/liveness', async (_request: Request, response: Response) => {
    response.json({ status: 'ok' });
  });

  return router;
}
