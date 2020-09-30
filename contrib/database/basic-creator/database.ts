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
import { getRootLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import knex, { Config } from 'knex';
import { Logger } from 'winston';

async function createDatabaseIfNotExists(
  connection: knex,
  plugin: string,
  logger: Logger,
) {
  const databaseName = `backstage_plugin_${plugin}`;
  return connection('pg_database')
    .select()
    .where({ datname: databaseName })
    .then(data => {
      if (data.length === 0) {
        logger.info(`Could not find database ${databaseName}, creating...`);
        return connection.raw(`CREATE DATABASE ${databaseName}`);
      }
      logger.info(`Database ${databaseName} already exists`);
      return Promise.resolve();
    });
}

export async function createDatabasesIfNotExists(
  config: ConfigReader,
  ...plugins: string[]
) {
  const logger = getRootLogger().child({ type: 'database-init' });
  if (config.getString('backend.database.client') === 'pg') {
    logger.info(`Using PostgreSQL, checking if databases exist..`);
    const connection = knex(
      config.getConfig('backend.database').get() as Config,
    );

    return Promise.all(
      plugins.map(plugin =>
        createDatabaseIfNotExists(connection, plugin, logger),
      ),
    ).finally(() => connection.destroy());
  }
  logger.info('Not using PostgreSQL, skipping database checks...');
  return Promise.resolve();
}
