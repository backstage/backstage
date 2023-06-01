/*
 * Copyright 2023 The Backstage Authors
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

import { SignalsServerConfig } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Server } from 'socket.io';
import { SignalsBroker } from './SignalsBroker';
import { ExtendedHttpServer } from '@backstage/backend-app-api';
import { CorsOptions } from 'cors';
import { Pool } from 'pg';
import { createAdapter } from '@socket.io/postgres-adapter';
import { Emitter } from '@socket.io/postgres-emitter';
import { normalizeConnection } from '../database/connection';
import { Knex } from 'knex';

const getAdapterAndEmitter = async (config: SignalsServerConfig) => {
  if (config.adapter === 'pg') {
    if (!config.databaseConnection) {
      throw new Error(
        'Config database.connection is required to enable signals adapter',
      );
    }
    const conn = normalizeConnection(
      config.databaseConnection,
      'pg',
    ) as Knex.PgConnectionConfig;
    const pool = new Pool({
      host: conn.host,
      port: conn.port,
      user: conn.user,
      password: conn.password,
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS backstage_signals (
            id          bigserial UNIQUE,
            created_at  timestamptz DEFAULT NOW(),
            payload     bytea
        );
    `);
    const adapter = createAdapter(pool, { tableName: 'backstage_signals' });
    const emitter = new Emitter(pool, undefined, {
      tableName: 'backstage_signals',
    });
    return { adapter, emitter };
  }
  return { adapter: undefined, emitter: undefined };
};

/**
 * Adds signals support on top of the Node.js HTTP server
 *
 * @public
 */
export async function createSignalsBroker(
  server: ExtendedHttpServer,
  deps: { logger: LoggerService },
  options?: SignalsServerConfig,
  cors?: CorsOptions,
) {
  if (!options?.enabled) {
    return;
  }

  const { adapter, emitter } = await getAdapterAndEmitter(options);
  const wss = new Server(server, { path: '/signals', cors });
  if (adapter) {
    wss.adapter(adapter);
  }
  SignalsBroker.create(
    wss,
    deps.logger.child({ type: 'signals-broker' }),
    emitter,
  );
}
