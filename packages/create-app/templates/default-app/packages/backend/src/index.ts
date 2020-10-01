/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import Router from 'express-promise-router';
import {
  ensureDatabaseExists,
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  SingleDatabaseConfiguration,
  SingleDatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import { PluginEnvironment } from './types';

function makeCreateEnv(config: ConfigReader) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);

  root.info(`Created UrlReader ${reader}`);

  const databaseConfig = new SingleDatabaseConfiguration(
    config.getConfig('backend.database'),
  )
  const databaseManager = new SingleDatabaseManager(databaseConfig);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const databaseFactory = databaseManager.getDatabaseFactory(plugin);
    return { logger, database: databaseFactory, config, reader, discovery };
  };
}

async function main() {
  const configs = await loadBackendConfig();
  const configReader = ConfigReader.fromConfigs(configs);
  const createEnv = makeCreateEnv(configReader);
  await ensureDatabaseExists(
    configReader.getConfig('backend.database'),
    'backstage_plugin_catalog',
    'backstage_plugin_auth',
  );

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv))
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv))
  apiRouter.use('/auth', await auth(authEnv))
  apiRouter.use('/techdocs', await techdocs(techdocsEnv))
  apiRouter.use('/proxy', await proxy(proxyEnv))
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
