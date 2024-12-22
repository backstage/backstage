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
  DatabaseManager,
  getRootLogger,
  HostDiscovery,
  loadBackendConfig,
  notFoundHandler,
  ServerTokenManager,
  useHotMemoize,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import { metricsHandler, metricsInit } from './metrics';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import events from './plugins/events';
import kubernetes from './plugins/kubernetes';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import search from './plugins/search';
import techdocs from './plugins/techdocs';
import app from './plugins/app';
import permission from './plugins/permission';
import signals from './plugins/signals';
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import { DefaultEventBroker } from '@backstage/plugin-events-backend';
import { DefaultEventsService } from '@backstage/plugin-events-node';
import { DefaultSignalsService } from '@backstage/plugin-signals-node';
import { UrlReaders } from '@backstage/backend-defaults/urlReader';
import { DefaultSchedulerService } from '@backstage/backend-defaults/scheduler';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = HostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
  const cacheManager = CacheManager.fromConfig(config);
  const identity = DefaultIdentityClient.create({
    discovery,
  });

  const eventsService = DefaultEventsService.create({ logger: root, config });
  const eventBroker = new DefaultEventBroker(
    root.child({ type: 'plugin' }),
    eventsService,
  );
  const signalsService = DefaultSignalsService.create({
    events: eventsService,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = DefaultSchedulerService.create({
      logger,
      database,
    });

    return {
      logger,
      cache,
      database,
      config,
      reader,
      eventBroker,
      events: eventsService,
      discovery,
      tokenManager,
      permissions,
      scheduler,
      identity,
      signals: signalsService,
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
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
  const eventsEnv = useHotMemoize(module, () => createEnv('events'));
  const signalsEnv = useHotMemoize(module, () => createEnv('signals'));

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/events', await events(eventsEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/permission', await permission(permissionEnv));
  apiRouter.use('/signals', await signals(signalsEnv));
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
