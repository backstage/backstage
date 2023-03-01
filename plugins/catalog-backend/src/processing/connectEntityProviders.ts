/*
 * Copyright 2021 The Backstage Authors
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
  Entity,
  entityEnvelopeSchemaValidator,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ProviderDatabase } from '../database/types';
import {
  EntityProvider,
  EntityProviderConnection,
  EntityProviderRefreshOptions,
  EntityProviderMutation,
} from '@backstage/plugin-catalog-node';

class Connection implements EntityProviderConnection {
  readonly validateEntityEnvelope = entityEnvelopeSchemaValidator();

  constructor(
    private readonly config: {
      id: string;
      providerDatabase: ProviderDatabase;
    },
  ) {}

  async applyMutation(mutation: EntityProviderMutation): Promise<void> {
    const db = this.config.providerDatabase;

    if (mutation.type === 'full') {
      this.check(mutation.entities.map(e => e.entity));
      await db.transaction(async tx => {
        await db.replaceUnprocessedEntities(tx, {
          sourceKey: this.config.id,
          type: 'full',
          items: mutation.entities,
        });
      });
    } else if (mutation.type === 'delta') {
      this.check(mutation.added.map(e => e.entity));
      this.check(
        mutation.removed
          .map(e => ('entity' in e ? e.entity : undefined))
          .filter((e): e is Entity => Boolean(e)),
      );
      await db.transaction(async tx => {
        await db.replaceUnprocessedEntities(tx, {
          sourceKey: this.config.id,
          type: 'delta',
          added: mutation.added,
          removed: mutation.removed.map(r =>
            'entityRef' in r
              ? r
              : {
                  entityRef: stringifyEntityRef(r.entity),
                  locationKey: r.locationKey,
                },
          ),
        });
      });
    }
  }

  async refresh(options: EntityProviderRefreshOptions): Promise<void> {
    const db = this.config.providerDatabase;

    await db.transaction(async (tx: any) => {
      return db.refreshByRefreshKeys(tx, {
        keys: options.keys,
      });
    });
  }

  private check(entities: Entity[]) {
    for (const entity of entities) {
      try {
        this.validateEntityEnvelope(entity);
      } catch (e) {
        throw new TypeError(`Malformed entity envelope, ${e}`);
      }
    }
  }
}

export async function connectEntityProviders(
  db: ProviderDatabase,
  providers: EntityProvider[],
) {
  await Promise.all(
    providers.map(async provider => {
      const connection = new Connection({
        id: provider.getProviderName(),
        providerDatabase: db,
      });
      return provider.connect(connection);
    }),
  );
}
