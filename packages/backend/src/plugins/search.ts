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
import { createRouter } from '@backstage/plugin-search-backend';
import {
  collateDocuments,
  // registerCollator,
} from '@backstage/plugin-search-indexer-backend';
import { PluginEnvironment } from '../types';
// import { SearchCollatorFactory } from '@backstage/plugin-catalog-backend';

export default async function createPlugin({ logger }: PluginEnvironment) {
  // TODO: Within this PR, update to use REST API instead of Catalog Builder.
  /* registerCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: SearchCollatorFactory(entitiesCatalog),
  });*/

  // TODO: Make this a more proper refresh loop.
  collateDocuments();

  return await createRouter({
    logger,
  });
}
