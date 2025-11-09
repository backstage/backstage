/*
 * Copyright 2025 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import type { RootSystemMetadataService } from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';

export async function createSystemMetadataRouter(options: {
  logger: LoggerService;
  systemMetadata: RootSystemMetadataService;
}) {
  const { systemMetadata } = options;

  const router = Router();

  router.get('/hosts', async (_, res) => {
    const hosts = await systemMetadata.getHosts();
    res.json({ items: hosts });
  });

  router.get('/plugins/installed', async (_, res) => {
    res.json(await systemMetadata.getInstalledPlugins());
  });

  return router;
}
