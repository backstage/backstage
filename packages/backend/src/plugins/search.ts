/*
 * Copyright 2021 The Backstage Authors
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
  PluginDatabaseManager,
  useHotCleanup,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
import { createRouter } from '@backstage/plugin-search-backend';
import { ElasticSearchSearchEngine } from '@backstage/plugin-search-backend-module-elasticsearch';
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg';
import {
  IndexBuilder,
  LunrSearchEngine,
  SearchEngine,
} from '@backstage/plugin-search-backend-node';
import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
import { Logger } from 'winston';
import { PluginEnvironment } from '../types';

async function createSearchEngine({
  logger,
  database,
  config,
}: {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}): Promise<SearchEngine> {
  if (config.has('search.elasticsearch')) {
    return await ElasticSearchSearchEngine.fromConfig({
      logger,
      config,
    });
  }

  if (await PgSearchEngine.supported(database)) {
    return await PgSearchEngine.from({ database });
  }

  return new LunrSearchEngine({ logger });
}

export default async function createPlugin({
  logger,
  discovery,
  config,
  database,
}: PluginEnvironment) {
  // Initialize a connection to a search engine.
  const searchEngine = await createSearchEngine({ config, logger, database });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  // Collators are responsible for gathering documents known to plugins. This
  // particular collator gathers entities from the software catalog.
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultCatalogCollator.fromConfig(config, { discovery }),
  });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      logger,
    }),
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();

  // A 3 second delay gives the backend server a chance to initialize before
  // any collators are executed, which may attempt requests against the API.
  setTimeout(() => scheduler.start(), 3000);
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger,
  });
}
