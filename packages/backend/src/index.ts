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

import { createServiceBuilder, getRootLogger } from '@backstage/backend-common';
import knex from 'knex';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import identity from './plugins/identity';
import scaffolder from './plugins/scaffolder';
import sentry from './plugins/sentry';
import { PluginEnvironment } from './types';

function createEnv(plugin: string): PluginEnvironment {
  const logger = getRootLogger().child({ type: 'plugin', plugin });
  const database = knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  return { logger, database };
}

async function main() {
  const service = createServiceBuilder()
    .enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
    .addRouter('/catalog', await catalog(createEnv('catalog')))
    .addRouter('/scaffolder', await scaffolder(createEnv('scaffolder')))
    .addRouter(
      '/sentry',
      await sentry(getRootLogger().child({ type: 'plugin', plugin: 'sentry' })),
    )
    .addRouter('/auth', await auth(createEnv('auth')))
    .addRouter('/identity', await identity(createEnv('identity')));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

main().catch(error => {
  console.error(`Backend failed to start up, ${error}`);
  process.exit(1);
});
