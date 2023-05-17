/*
 * Copyright 2022 The Backstage Authors
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

import { loadBackendConfig } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-incident-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const logger = env.logger.child({ service: 'incident-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });

  return createRouter(
    {
      apiKey: config.getString('incident.apiKey'),
      endpoint: config.getString('incident.endpoint'),
      schedule: {
        frequency: { seconds: 60 },
        timeout: { seconds: 30 },
        initialDelay: { seconds: 1 },
      },
    },
    { ...env },
  );
}
