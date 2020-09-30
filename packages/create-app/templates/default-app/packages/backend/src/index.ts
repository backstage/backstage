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
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
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

  const catalogEnv = useHotMemoize(module, async () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, async () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, async () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, async () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, async () => createEnv('techdocs'));

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(await catalogEnv))
  apiRouter.use('/scaffolder', await scaffolder(await scaffolderEnv))
  apiRouter.use('/auth', await auth(await authEnv))
  apiRouter.use('/techdocs', await techdocs(await techdocsEnv))
  apiRouter.use('/proxy', await proxy(await proxyEnv))
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(configReader)
    .addRouter('/api', apiRouter)

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error(`Backend failed to start up, ${error}`);
  process.exit(1);
});
