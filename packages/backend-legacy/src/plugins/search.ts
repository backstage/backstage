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

import { useHotCleanup } from '@backstage/backend-common';
import { ToolDocumentCollatorFactory } from '@backstage/plugin-search-backend-module-explore';
import { createRouter } from '@backstage/plugin-search-backend';
import { ElasticSearchSearchEngine } from '@backstage/plugin-search-backend-module-elasticsearch';
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg';
import {
  IndexBuilder,
  SearchEngine,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-search-backend-module-techdocs';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

async function createSearchEngine(
  env: PluginEnvironment,
): Promise<SearchEngine> {
  if (env.config.has('search.elasticsearch')) {
    return await ElasticSearchSearchEngine.fromConfig({
      logger: env.logger,
      config: env.config,
    });
  }

  if (await PgSearchEngine.supported(env.database)) {
    return await PgSearchEngine.fromConfig(env.config, {
      database: env.database,
      logger: env.logger,
    });
  }

  return new LunrSearchEngine({ logger: env.logger });
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // Initialize a connection to a search engine.
  const searchEngine = await createSearchEngine(env);
  const indexBuilder = new IndexBuilder({
    logger: env.logger,
    searchEngine,
  });

  const schedule = env.scheduler.createScheduledTaskRunner({
    frequency: { minutes: 10 },
    timeout: { minutes: 15 },
    // A 3 second delay gives the backend server a chance to initialize before
    // any collators are executed, which may attempt requests against the API.
    initialDelay: { seconds: 3 },
  });

  indexBuilder.addCollator({
    schedule,
    factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      logger: env.logger,
      tokenManager: env.tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule,
    factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      logger: env.logger,
    }),
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();
  scheduler.start();

  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    discovery: env.discovery,
    permissions: env.permissions,
    config: env.config,
    logger: env.logger,
  });
}
