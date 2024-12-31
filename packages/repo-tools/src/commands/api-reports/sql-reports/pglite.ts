/*
 * Copyright 2024 The Backstage Authors
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
import { PGlite } from '@electric-sql/pglite';
import { Client, Knex } from 'knex';

const Client_PG: any = require('knex/lib/dialects/postgres/index.js');

type KnexPGliteConfig = Knex.Config & { connection: { pglite?: PGlite } };

export class PgLiteClient extends Client_PG {
  private pglite: PGlite | undefined;

  constructor(config: KnexPGliteConfig) {
    super({
      ...config,
      client: 'pg',
      // Enforce a single connection:
      pool: { min: 1, max: 1 },
    } satisfies Knex.Config);
    if (config.pool) {
      throw new Error(
        'PGlite is single user/connection. Pool cannot be configured.',
      );
    }
    this.pglite =
      config.connection?.pglite ??
      new PGlite(
        config.connection?.['filename'] ??
          config.connection?.['connectionString'],
      );
  }

  _driver() {}

  async _acquireOnlyConnection() {
    const connection = this.pglite;
    await connection.waitReady;
    return connection;
  }

  async destroyRawConnection(connection: PGlite) {
    // There is only one connection, if this one goes shut down the database
    await connection.close();
  }

  async setSchemaSearchPath(
    connection: PGlite,
    searchPath: string,
  ): Promise<boolean> {
    let path = searchPath || this.searchPath;

    if (!path) {
      return true;
    }

    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new TypeError(
        `knex: Expected searchPath to be Array/String, got: ${typeof path}`,
      );
    }

    if (typeof path === 'string') {
      if (path.includes(',')) {
        const parts = path.split(',');
        const arraySyntax = `[${parts
          .map(searchPath => `'${searchPath}'`)
          .join(', ')}]`;
        this.logger.warn?.(
          `Detected comma in searchPath "${path}".` +
            `If you are trying to specify multiple schemas, use Array syntax: ${arraySyntax}`,
        );
      }
      path = [path];
    }

    path = path.map((schemaName: string) => `"${schemaName}"`).join(',');

    await connection.query(`set search_path to ${path}`);
    return true;
  }

  async checkVersion(connection: PGlite) {
    const resp = await connection.query('select version();');
    return this._parseVersion((resp.rows[0] as any).version);
  }

  async _query(connection: PGlite, obj: any) {
    if (!obj.sql) throw new Error('The query is empty');

    const response = await connection.query(obj.sql, obj.bindings, obj.options);
    obj.response = response;
    return obj;
  }

  processResponse(obj: any, runner: any) {
    const response = {
      ...obj.response,
      rowCount: obj.response.affectedRows,
      command: (obj.method as string)?.toUpperCase() ?? '',
    };
    return super.processResponse({ ...obj, response }, runner);
  }

  _stream(connection: PGlite, obj: any, stream: any) {
    return new Promise((resolver, rejecter) => {
      stream.on('error', rejecter);
      stream.on('end', resolver);

      return this._query(connection, obj)
        .then(obj => obj.response.rows)
        .then(rows => rows.forEach((row: any) => stream.write(row)))
        .catch(err => {
          stream.emit('error', err);
        })
        .then(() => {
          stream.end();
        });
    });
  }
}

Object.assign(PgLiteClient.prototype, {
  // The "dialect", for reference .
  driverName: 'postgres',
});
