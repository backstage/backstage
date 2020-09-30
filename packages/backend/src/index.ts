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

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import Router from 'express-promise-router';
import {
  createDatabaseClient,
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { ConfigReader, AppConfig } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import kubernetes from './plugins/kubernetes';
import rollbar from './plugins/rollbar';
import scaffolder from './plugins/scaffolder';
import sentry from './plugins/sentry';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import graphql from './plugins/graphql';
import app from './plugins/app';
import { PluginEnvironment } from './types';

function makeCreateEnv(loadedConfigs: AppConfig[]) {
  const config = ConfigReader.fromConfigs(loadedConfigs);

  return async (plugin: string): Promise<PluginEnvironment> => {
    const logger = getRootLogger().child({ type: 'plugin', plugin });
    const database = await createDatabaseClient(
      config.getConfig('backend.database'),
      {
        connection: {
          database: `backstage_plugin_${plugin}`,
        },
      },
    );
    const discovery = SingleHostDiscovery.fromConfig(config);
    return { logger, database, config, discovery };
  };
}

async function main() {
  const configs = await loadBackendConfig();
  const configReader = ConfigReader.fromConfigs(configs);
  const createEnv = makeCreateEnv(configs);
  const healthcheckEnv = useHotMemoize(module, async () =>
    createEnv('healthcheck'),
  );
  const catalogEnv = useHotMemoize(module, async () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, async () =>
    createEnv('scaffolder'),
  );
  const authEnv = useHotMemoize(module, async () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, async () => createEnv('proxy'));
  const rollbarEnv = useHotMemoize(module, async () => createEnv('rollbar'));
  const sentryEnv = useHotMemoize(module, async () => createEnv('sentry'));
  const techdocsEnv = useHotMemoize(module, async () => createEnv('techdocs'));
  const kubernetesEnv = useHotMemoize(module, async () =>
    createEnv('kubernetes'),
  );
  const graphqlEnv = useHotMemoize(module, async () => createEnv('graphql'));
  const appEnv = useHotMemoize(module, async () => createEnv('app'));

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(await catalogEnv));
  apiRouter.use('/rollbar', await rollbar(await rollbarEnv));
  apiRouter.use('/scaffolder', await scaffolder(await scaffolderEnv));
  apiRouter.use('/sentry', await sentry(await sentryEnv));
  apiRouter.use('/auth', await auth(await authEnv));
  apiRouter.use('/techdocs', await techdocs(await techdocsEnv));
  apiRouter.use('/kubernetes', await kubernetes(await kubernetesEnv));
  apiRouter.use('/proxy', await proxy(await proxyEnv));
  apiRouter.use('/graphql', await graphql(await graphqlEnv));
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(configReader)
    .addRouter('', await healthcheck(await healthcheckEnv))
    .addRouter('/api', apiRouter)
    .addRouter('', await app(await appEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
