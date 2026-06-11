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

import {
  DatabaseService,
  KeyValueStoreNamespace,
  KeyValueStoreService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { EventsService } from '@backstage/plugin-events-node';
import { z } from 'zod/v4';
import { Knex } from 'knex';
import { once } from 'lodash';
import { DB_MIGRATIONS_TABLE } from './database/tables';
import { DefaultKeyValueStoreNamespace } from './DefaultKeyValueStoreNamespace';

const NAMESPACE_PATTERN = /^[a-z0-9-]+$/;

const migrationsDir = resolvePackagePath(
  '@backstage/backend-defaults',
  'migrations/keyValueStore',
);

async function migrateKeyValueStore(knex: Knex): Promise<void> {
  await knex.migrate.latest({
    directory: migrationsDir,
    tableName: DB_MIGRATIONS_TABLE,
  });
}

/**
 * Default database-backed implementation of the {@link @backstage/backend-plugin-api#KeyValueStoreService}.
 *
 * @public
 */
export class DefaultKeyValueStoreService implements KeyValueStoreService {
  static create(options: {
    database: DatabaseService;
    events?: EventsService;
    pluginId?: string;
  }): KeyValueStoreService {
    const getClient = once(async () => {
      const knex = await options.database.getClient();
      if (!options.database.migrations?.skip) {
        await migrateKeyValueStore(knex);
      }
      return knex;
    });
    return new DefaultKeyValueStoreService(
      getClient,
      options.events,
      options.pluginId ?? 'unknown',
    );
  }

  private constructor(
    private readonly getClient: () => Promise<Knex>,
    private readonly events: EventsService | undefined,
    private readonly pluginId: string,
  ) {}

  withSchema<TSchema extends z.ZodType>(options: {
    namespace: string;
    schema: TSchema;
  }): KeyValueStoreNamespace<z.input<TSchema>, z.output<TSchema>> {
    if (!NAMESPACE_PATTERN.test(options.namespace)) {
      throw new Error(
        `Invalid key-value store namespace '${options.namespace}': must be a non-empty string matching [a-z0-9-]+`,
      );
    }
    return new DefaultKeyValueStoreNamespace(
      this.getClient,
      options.namespace,
      options.schema,
      this.events,
      this.pluginId,
    );
  }
}
