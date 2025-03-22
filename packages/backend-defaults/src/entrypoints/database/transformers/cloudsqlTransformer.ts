/*
 * Copyright 2020 The Backstage Authors
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

interface CloudSqlConnection {
  type: string;
  instance: string;
  ipAddressType: any;
}

export async function cloudsqlTransformer(
  config: Knex.Config,
): Promise<Knex.Config> {
  const sanitizedConfig = JSON.parse(JSON.stringify(config));
  if (!config.connection) {
    throw new Error(`cloudsql config.connection object can not be empty`);
  } else if (
    typeof config.connection === 'string' ||
    typeof config.connection === 'function'
  ) {
    throw new Error(
      `cloudsql config.connection must implement Knex.StaticConnectionConfig`,
    );
  }
  const cloudSqlConnection: CloudSqlConnection = config.connection as any;

  // Trim additional properties from the connection object passed to knex
  delete sanitizedConfig.connection.type;
  delete sanitizedConfig.connection.instance;

  if (cloudSqlConnection.type !== 'cloudsql') {
    throw new Error(`Unknown connection type: ${cloudSqlConnection.type}`);
  }

  if (config.client !== 'pg') {
    throw new Error('Cloud SQL only supports the pg client');
  }

  if (!cloudSqlConnection.instance) {
    throw new Error('Missing instance connection name for Cloud SQL');
  }

  const {
    Connector: CloudSqlConnector,
    IpAddressTypes,
    AuthTypes,
  } = require('@google-cloud/cloud-sql-connector') as typeof import('@google-cloud/cloud-sql-connector');
  const connector = new CloudSqlConnector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: cloudSqlConnection.instance,
    ipType: cloudSqlConnection.ipAddressType ?? IpAddressTypes.PUBLIC,
    authType: AuthTypes.IAM,
  });

  return {
    ...sanitizedConfig,
    client: 'pg',
    connection: {
      ...sanitizedConfig.connection,
      ...clientOpts,
    },
  };
}
