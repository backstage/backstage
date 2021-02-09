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

import {
  CookieCutter,
  createRouter,
  Preparers,
  Publishers,
  CreateReactAppTemplater,
  Templaters,
  CatalogEntityClient,
} from '@backstage/plugin-scaffolder-backend';
import { SingleHostDiscovery } from '@backstage/backend-common';
import type { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
  database,
}: PluginEnvironment) {
  const cookiecutterTemplater = new CookieCutter();
  const craTemplater = new CreateReactAppTemplater();
  const templaters = new Templaters();

  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const preparers = await Preparers.fromConfig(config, { logger });
  const publishers = await Publishers.fromConfig(config, { logger });

  const dockerClient = new Docker();

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    entityClient,
    database,
  });
}
