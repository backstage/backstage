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
  KeyValueStoreChangeEvent,
  KeyValueStoreNamespace,
  KeyValueStoreNamespaceEntry,
} from '@backstage/backend-plugin-api';
import { ConflictError } from '@backstage/errors';
import { EventsService } from '@backstage/plugin-events-node';
import { z } from 'zod/v4';
import { createHash } from 'node:crypto';
import { Knex } from 'knex';
import {
  DB_KEY_VALUE_STORE_TABLE,
  DbKeyValueStoreRow,
} from './database/tables';

function computeEtag(serialized: string): string {
  return createHash('sha256').update(serialized).digest('hex');
}

/** @internal */
export class DefaultKeyValueStoreNamespace<TInput, TOutput>
  implements KeyValueStoreNamespace<TInput, TOutput>
{
  private readonly prefix: string;
  private readonly topic: string;

  constructor(
    private readonly getClient: () => Promise<Knex>,
    private readonly namespace: string,
    private readonly schema: z.ZodType,
    private readonly events: EventsService | undefined,
    pluginId: string,
  ) {
    this.prefix = `${namespace}/`;
    this.topic = `keyValueStore.${pluginId}.${namespace}`;
  }

  async get(
    key: string,
  ): Promise<{ value: TOutput; etag: string } | undefined> {
    const knex = await this.getClient();
    const row = await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .where({ key: `${this.prefix}${key}` })
      .first();
    if (!row) {
      return undefined;
    }
    return {
      value: this.schema.parse(JSON.parse(row.value)) as TOutput,
      etag: computeEtag(row.value),
    };
  }

  async set(
    key: string,
    value: TInput,
    options?: { etag?: string },
  ): Promise<{ etag: string }> {
    const knex = await this.getClient();
    const parsed = this.schema.parse(value);
    const serialized = JSON.stringify(parsed);
    const newEtag = computeEtag(serialized);
    const dbKey = `${this.prefix}${key}`;

    if (options?.etag) {
      await knex.transaction(async trx => {
        const existing = await trx<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
          .where({ key: dbKey })
          .first();

        const currentEtag = existing ? computeEtag(existing.value) : undefined;
        if (currentEtag !== options.etag) {
          throw new ConflictError(
            `Etag mismatch for key '${key}': expected '${
              options.etag
            }' but found '${currentEtag ?? 'none'}'`,
          );
        }

        await trx<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
          .where({ key: dbKey })
          .update({ value: serialized, updated_at: knex.fn.now() });
      });
    } else {
      await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
        .insert({ key: dbKey, value: serialized, updated_at: knex.fn.now() })
        .onConflict('key')
        .merge({ value: serialized, updated_at: knex.fn.now() });
    }

    await this.emitChange({ action: 'set', key, etag: newEtag });
    return { etag: newEtag };
  }

  async delete(key: string): Promise<void> {
    const knex = await this.getClient();
    await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .where({ key: `${this.prefix}${key}` })
      .delete();

    await this.emitChange({ action: 'delete', key });
  }

  async list(): Promise<KeyValueStoreNamespaceEntry<TOutput>[]> {
    const knex = await this.getClient();
    const rows = await knex<DbKeyValueStoreRow>(DB_KEY_VALUE_STORE_TABLE)
      .select('key', 'value')
      .where('key', 'like', `${this.prefix}%`);
    return rows.map(row => ({
      key: row.key.slice(this.prefix.length),
      value: this.schema.parse(JSON.parse(row.value)) as TOutput,
      etag: computeEtag(row.value),
    }));
  }

  async subscribe(subscriber: {
    id: string;
    onEvent: (event: KeyValueStoreChangeEvent) => Promise<void>;
  }): Promise<{ unsubscribe: () => void }> {
    if (!this.events) {
      throw new Error(
        'Cannot subscribe to key-value store changes: no EventsService available',
      );
    }
    let active = true;
    await this.events.subscribe({
      id: subscriber.id,
      topics: [this.topic],
      onEvent: async params => {
        if (active) {
          await subscriber.onEvent(
            params.eventPayload as KeyValueStoreChangeEvent,
          );
        }
      },
    });
    return {
      unsubscribe: () => {
        active = false;
      },
    };
  }

  private async emitChange(
    event: Omit<KeyValueStoreChangeEvent, 'namespace'>,
  ): Promise<void> {
    await this.events?.publish({
      topic: this.topic,
      eventPayload: { ...event, namespace: this.namespace },
    });
  }
}
