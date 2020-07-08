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

import {
  createServiceBuilder,
  getRootLogger,
  useHotMemoize,
} from '@backstage/backend-common';
import { ConfigReader, AppConfig } from '@backstage/config';
import { loadConfig } from '@backstage/config-loader';
import knex from 'knex';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import identity from './plugins/identity';
import scaffolder from './plugins/scaffolder';
import sentry from './plugins/sentry';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import { PluginEnvironment } from './types';

function makeCreateEnv(loadedConfigs: AppConfig[]) {
  const config = ConfigReader.fromConfigs(loadedConfigs);

  return (plugin: string): PluginEnvironment => {
    const logger = getRootLogger().child({ type: 'plugin', plugin });
    const database = knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });
    return { logger, database, config };
  };
}

async function main() {
  const configs = await loadConfig();
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
    .addRouter(
      '/sentry',
      await sentry(getRootLogger().child({ type: 'plugin', plugin: 'sentry' })),
    )
    .addRouter('/auth', await auth(authEnv))
    .addRouter('/identity', await identity(identityEnv))
    .addRouter('/techdocs', await techdocs(techdocsEnv))
    .addRouter('/', await proxy(proxyEnv));

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
