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
import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import { IndexBuilder } from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

export default async function createPlugin(env: PluginEnvironment) {
  const { logger } = env;
  const indexBuilder = new IndexBuilder({ logger });

  indexBuilder.addCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: await DefaultCatalogCollator.fromEnv(env),
  });

  // TODO: Move refresh loop logic into the builder.
  const timerId = setInterval(() => {
    indexBuilder.build();
  }, 60000);
  useHotCleanup(module, () => clearInterval(timerId));

  return await createRouter({
    logger,
  });
}
