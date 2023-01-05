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

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import Router from 'express-promise-router';
import {
  CacheManager,
  createServiceBuilder,
  getRootLogger,
  loadBackendConfig,
  notFoundHandler,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  useHotMemoize,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import { metricsInit, metricsHandler } from './metrics';
import auth from './plugins/auth';
import azureDevOps from './plugins/azure-devops';
import catalog from './plugins/catalog';
import catalogEventBasedProviders from './plugins/catalogEventBasedProviders';
import codeCoverage from './plugins/codecoverage';
import events from './plugins/events';
import explore from './plugins/explore';
import kubernetes from './plugins/kubernetes';
import kafka from './plugins/kafka';
import rollbar from './plugins/rollbar';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import search from './plugins/search';
import techdocs from './plugins/techdocs';
import techInsights from './plugins/techInsights';
import todo from './plugins/todo';
import graphql from './plugins/graphql';
import app from './plugins/app';
import badges from './plugins/badges';
import jenkins from './plugins/jenkins';
import permission from './plugins/permission';
import playlist from './plugins/playlist';
import adr from './plugins/adr';
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
  const cacheManager = CacheManager.fromConfig(config);
  const taskScheduler = TaskScheduler.fromConfig(config);
  const identity = DefaultIdentityClient.create({
    discovery,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);

    return {
      logger,
      cache,
      database,
      config,
      reader,
      discovery,
      tokenManager,
      permissions,
      scheduler,
      identity,
    };
  };
}

async function main() {
  metricsInit();
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
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const codeCoverageEnv = useHotMemoize(module, () =>
    createEnv('code-coverage'),
  );
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const azureDevOpsEnv = useHotMemoize(module, () => createEnv('azure-devops'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const rollbarEnv = useHotMemoize(module, () => createEnv('rollbar'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const todoEnv = useHotMemoize(module, () => createEnv('todo'));
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  const kafkaEnv = useHotMemoize(module, () => createEnv('kafka'));
  const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const badgesEnv = useHotMemoize(module, () => createEnv('badges'));
  const jenkinsEnv = useHotMemoize(module, () => createEnv('jenkins'));
  const adrEnv = useHotMemoize(module, () => createEnv('adr'));
  const techInsightsEnv = useHotMemoize(module, () =>
    createEnv('tech-insights'),
  );
  const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
  const playlistEnv = useHotMemoize(module, () => createEnv('playlist'));
  const eventsEnv = useHotMemoize(module, () => createEnv('events'));
  const exploreEnv = useHotMemoize(module, () => createEnv('explore'));

  const eventBasedEntityProviders = await catalogEventBasedProviders(
    catalogEnv,
  );

  const apiRouter = Router();
  apiRouter.use(
    '/catalog',
    await catalog(catalogEnv, eventBasedEntityProviders),
  );
  apiRouter.use('/code-coverage', await codeCoverage(codeCoverageEnv));
  apiRouter.use('/events', await events(eventsEnv, eventBasedEntityProviders));
  apiRouter.use('/rollbar', await rollbar(rollbarEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  apiRouter.use('/tech-insights', await techInsights(techInsightsEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/azure-devops', await azureDevOps(azureDevOpsEnv));
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/todo', await todo(todoEnv));
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/kafka', await kafka(kafkaEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/graphql', await graphql(graphqlEnv));
  apiRouter.use('/badges', await badges(badgesEnv));
  apiRouter.use('/jenkins', await jenkins(jenkinsEnv));
  apiRouter.use('/permission', await permission(permissionEnv));
  apiRouter.use('/playlist', await playlist(playlistEnv));
  apiRouter.use('/explore', await explore(exploreEnv));
  apiRouter.use('/adr', await adr(adrEnv));
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('', metricsHandler())
    .addRouter('/api', apiRouter)
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
