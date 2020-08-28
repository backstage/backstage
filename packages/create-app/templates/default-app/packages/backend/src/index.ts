/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import {
  createDatabase,
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
} from '@backstage/backend-common';
import { ConfigReader, AppConfig } from '@backstage/config';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import identity from './plugins/identity';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import { PluginEnvironment } from './types';

function makeCreateEnv(loadedConfigs: AppConfig[]) {
  const config = ConfigReader.fromConfigs(loadedConfigs);

  return (plugin: string): PluginEnvironment => {
    const logger = getRootLogger().child({ type: 'plugin', plugin });
    const database = createDatabase(config.getConfig('backend.database'), {
      connection: {
        database: `backstage_plugin_${plugin}`,
      },
    });
    return { logger, database, config };
  };
}

async function main() {
  const configs = await loadBackendConfig();
  const configReader = ConfigReader.fromConfigs(configs);
  const createEnv = makeCreateEnv(configs);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const identityEnv = useHotMemoize(module, () => createEnv('identity'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));

  const service = createServiceBuilder(module)
    .loadConfig(configReader)
    .addRouter('/catalog', await catalog(catalogEnv))
    .addRouter('/scaffolder', await scaffolder(scaffolderEnv))
    .addRouter('/auth', await auth(authEnv))
    .addRouter('/identity', await identity(identityEnv))
    .addRouter('/techdocs', await techdocs(techdocsEnv))
    .addRouter('/proxy', await proxy(proxyEnv));

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
