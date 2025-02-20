/*
 * Copyright 2025 The Backstage Authors
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

import { Knex } from 'knex';

export async function noopTransformer(
  config: Knex.Config,
): Promise<Knex.Config> {
  if (!config.connection) {
    throw new Error(`pg-cluster config.connection object can not be empty`);
  } else if (
    typeof config.connection === 'string' ||
    typeof config.connection === 'function'
  ) {
    throw new Error(
      `pg-cluster config.connection must implement Knex.StaticConnectionConfig`,
    );
  }
  if (
    !(config.connection as any).type ||
    (config.connection as any).type !== 'noop'
  ) {
    throw new Error(
      `config.connection.type must be pg-cluster to be used with pgClusterTransformer`,
    );
  }
  const copy = (object: Object) => {
    return JSON.parse(JSON.stringify(object));
  };

  const transformedConfig: Knex.Config = copy(config);
  transformedConfig.connection = () => {
    const connection: Knex.PgConnectionConfig = copy(config.connection || {});
    console.log(
      `configuration provider was called for ${connection.application_name}`,
    );
    connection.expirationChecker = () => {
      console.log(
        `expiration checker was called for ${connection.application_name}`,
      );
      return false;
    };
    return connection;
  };
  return transformedConfig;
}
