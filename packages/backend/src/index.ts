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

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import {
  CacheManager,
  createPluginRouter,
  createServiceBuilder,
  getRootLogger,
  loadBackendConfig,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  useHotMemoize,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import app from './plugins/app';
import { PluginEnvironment } from './types';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);

  root.info(`Created UrlReader ${reader}`);

  const databaseManager = DatabaseManager.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    return { logger, cache, database, config, reader, discovery };
  };
}

async function main() {
  const logger = getRootLogger();

  logger.info(
    `You are running an example backend, which is supposed to be mainly used for contributing back to Backstage. ` +
      `Do NOT deploy this to production. Read more here https://backstage.io/docs/getting-started/`,
  );

  const config = await loadBackendConfig({
    argv: process.argv,
    logger,
  });
  const createEnv = makeCreateEnv(config);

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));

  const pluginRouter = await createPluginRouter(
    { module, createEnv },
    {
      auth: () => import('./plugins/auth'),
      badges: () => import('./plugins/badges'),
      catalog: () => import('./plugins/catalog'),
      'code-coverage': () => import('./plugins/codecoverage'),
      graphql: () => import('./plugins/graphql'),
      jenkins: () => import('./plugins/jenkins'),
      kafka: () => import('./plugins/kafka'),
      kubernetes: () => import('./plugins/kubernetes'),
      proxy: () => import('./plugins/proxy'),
      rollbar: () => import('./plugins/rollbar'),
      scaffolder: () => import('./plugins/scaffolder'),
      search: () => import('./plugins/search'),
      techdocs: () => import('./plugins/techdocs'),
      todo: () => import('./plugins/todo'),
    },
  );

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('/api', pluginRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
