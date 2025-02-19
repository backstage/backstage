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

import { KnexConnectionConfig } from '../types';

export async function googleCloudConnectionTransformer(
  connection: KnexConnectionConfig,
): Promise<KnexConnectionConfig> {
  const config = {
    client: 'pg',
    connection: connection as any,
  };
  const sanitizedConfig = JSON.parse(JSON.stringify(config));

  // Trim additional properties from the connection object passed to knex
  delete sanitizedConfig.connection.type;
  delete sanitizedConfig.connection.instance;

  if (config.connection.type === 'default' || !config.connection.type) {
    return sanitizedConfig;
  }

  if (config.connection.type !== 'cloudsql') {
    throw new Error(`Unknown connection type: ${config.connection.type}`);
  }

  if (config.client !== 'pg') {
    throw new Error('Cloud SQL only supports the pg client');
  }

  if (!config.connection.instance) {
    throw new Error('Missing instance connection name for Cloud SQL');
  }

  const {
    Connector: CloudSqlConnector,
    IpAddressTypes,
    AuthTypes,
  } = require('@google-cloud/cloud-sql-connector') as typeof import('@google-cloud/cloud-sql-connector');
  const connector = new CloudSqlConnector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: config.connection.instance,
    ipType: config.connection.ipAddressType ?? IpAddressTypes.PUBLIC,
    authType: AuthTypes.IAM,
  });

  return {
    ...sanitizedConfig.connection,
    ...clientOpts,
  };
}
