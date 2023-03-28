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

import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  DeferredEntity,
  EntityProviderMutation,
} from '@backstage/plugin-catalog-node';
import { Knex } from 'knex';
import chunk from 'lodash/chunk';
import { computeHash } from './util';

// const validateEntityEnvelope = entityEnvelopeSchemaValidator();

export const internals = {
  /**
   * Creates a new empty delivery.
   */
  async createDelivery(options: {
    tx: Knex.Transaction;
    sourceKey: string;
    action: string;
  }): Promise<{ deliveryId: string }> {
    const { tx, sourceKey, action } = options;

    const row = {
      source_key: sourceKey,
      action: action,
      started_at: tx.fn.now(),
      ended_at: null,
    };

    if (tx.client.config.client.includes('mysql')) {
      await tx.insert(row).into('deliveries');
      const result = await tx.select<[{ id: number }]>(
        tx.raw('LAST_INSERT_ID() as id'),
      );
      return {
        deliveryId: String(result[0].id),
      };
    }

    const result = await tx
      .insert(row)
      .into('deliveries')
      .returning<[{ id: string | number }]>('id');
    return {
      deliveryId: String(result[0].id),
    };
  },
  /**
   * Closes an existing delivery as completed.
   */
  async closeDelivery(options: {
    tx: Knex.Transaction;
    deliveryId: string;
  }): Promise<void> {
    const { tx, deliveryId } = options;
    await tx
      .table('deliveries')
      .update({ ended_at: tx.fn.now() })
      .where('id', '=', deliveryId);
  },
  /**
   * Attempts to upsert some delivered data into the provider state table.
   */
  async upsertProviderState(options: {
    tx: Knex.Transaction;
    deliveryId: string;
    sourceKey: string;
    deferred: DeferredEntity[];
  }): Promise<void> {
    const { tx, deliveryId, sourceKey, deferred } = options;

    const providerStateRows = new Array<any>();

    for (const { entity, locationKey } of deferred) {
      const entityRef = stringifyEntityRef(entity);
      const blob = JSON.stringify(entity);
      const hash = computeHash(`${blob}${locationKey ?? ''}`);
      providerStateRows.push({
        source_key: sourceKey,
        entity_ref: entityRef,
        location_key: locationKey ?? null,
        deleted: false,
        latest_delivery_id: deliveryId,
        unprocessed_entity: blob,
        unprocessed_entity_hash: hash,
      });
    }

    // We keep track of the entity refs that we think should be considered for
    // promotion to the refresh state
    const entityRefsToPromote = new Set<string>();
    const insertedCount = 0;
    const updatedCount = 0;

    for (const currentChunk of chunk(providerStateRows, 100)) {
      // First fetch any existing state concerning these rows, while setting
      // their last seen delivery ID to ours. It's important to update that ID,
      // to ensure that full replacements can compare against it while sweeping
      // away old state.
      let oldRows: any[];
      if (!tx.client.config.client.includes('mysql')) {
        oldRows = await tx
          .table('provider_state')
          .update({ latest_delivery_id: deliveryId })
          .where('source_key', '=', sourceKey)
          .whereIn(
            'entity_ref',
            currentChunk.map(r => r.entity_ref),
          )
          .returning(['entity_ref', 'unprocessed_entity_hash']);
      } else {
        // MySQL doesn't support returning on updates, so we have to do two queries
        oldRows = await tx
          .select(['entity_ref', 'unprocessed_entity_hash'])
          .from('provider_state')
          .where('source_key', '=', sourceKey)
          .whereIn(
            'entity_ref',
            currentChunk.map(r => r.entity_ref),
          );
        await tx
          .table('provider_state')
          .update({ latest_delivery_id: deliveryId })
          .where('source_key', '=', sourceKey)
          .whereIn(
            'entity_ref',
            currentChunk.map(r => r.entity_ref),
          );
      }
      const oldHashesByEntityRef = new Map(
        oldRows.map(r => [r.entity_ref, r.unprocessed_entity_hash]),
      );

      // Those that didn't exist, we try to insert. The rest we update, but only
      // if their hash changed.
      const insertRows = currentChunk.filter(r => {
        return !oldHashesByEntityRef.has(r.entity_ref);
      });
      const updateRows = currentChunk.filter(r => {
        const oldHash = oldHashesByEntityRef.get(r.entity_ref);
        return oldHash && oldHash !== r.unprocessed_entity_hash;
      });
      insertRows.forEach(r => entityRefsToPromote.add(r.entity_ref));
      updateRows.forEach(r => entityRefsToPromote.add(r.entity_ref));

      /*
      // First try all the inserts
      if (insertRows.length > 0) {
        const result = await tx
          .insert(insertRows)
          .into('provider_state')
          .onConflict(['source_key', 'entity_ref'])
          .ignore()
          .returning('entity_ref');

        // The returned set of refs are the ones that actually succeeded; we try
        // to recover gracefully from conflict due to a race condition where an
        // overlapping delivery also inserted rows with the same entity ref, by
        // pushing those missed rows back onto the update queue instead.
        insertedCount += result.length;
        if (result.length !== insertRows.length) {
          const successfulEntityRefs = new Set(result.map(r => r.entity_ref));
          updateRows.push(
            ...insertRows.filter(r => !successfulEntityRefs.has(r.entity_ref)),
          );
        }
      }

      // Then do all the updates
      if (updateRows.length > 0) {
        for (const row of updateRows) {
          await tx
            .table('provider_state')
            .update({
              location_key: row.location_key,
              deleted: row.deleted,
              unprocessed_entity: row.unprocessed_entity,
              unprocessed_entity_hash: row.unprocessed_entity_hash,
            })
            .where('source_key', '=', sourceKey)
            .where('entity_ref', '=', row.entity_ref);
        }

        updatedCount += updateRows.length;
      }
      */
    }
  },
  /**
   * Persists a `delta` type mutation as a delivery and its entries.
   */
  // async writeDeltaMutation(
  //   tx: Knex.Transaction,
  //   sourceKey: string,
  //   added: DeferredEntity[],
  //   removed: string[],
  // ): Promise<{ deliveryId: string }> {
  //   const deliveryId = await tx
  //     .insert({
  //       provider_name: providerName,
  //       action: 'delta',
  //       started_at: tx.fn.now(),
  //       ended_at: tx.fn.now(),
  //     })
  //     .into('deliveries')
  //     .returning('id')
  //     .then(row => row[0].id);

  //   if (added.length) {
  //     const blobs = added.map(d => JSON.stringify(d));
  //     const { etags } = await ensureBlobs({ tx, blobs });
  //     await tx.batchInsert(
  //       'delivery_entries',
  //       etags.map(etag => ({
  //         delivery_id: deliveryId,
  //         blob_etag: etag,
  //       })),
  //       200,
  //     );
  //   }

  //   if (removed.length) {
  //     await tx.batchInsert(
  //       'delivery_entries',
  //       removed.map(entityRef => ({
  //         delivery_id: deliveryId,
  //         value: entityRef,
  //       })),
  //       200,
  //     );
  //   }

  //   return { deliveryId };
  // },
};

/**
 * Persists a single delivery into the database.
 */
export async function writeDelivery(options: {
  tx: Knex.Transaction;
  sourceKey: string;
  delivery: EntityProviderMutation;
}): Promise<{ deliveryId: string }> {
  const { tx, sourceKey, delivery } = options;

  if (delivery.type === 'full') {
    const { deliveryId } = await internals.createDelivery({
      tx,
      sourceKey,
      action: 'replace',
    });
    await internals.upsertProviderState({
      tx,
      deliveryId,
      sourceKey,
      deferred: delivery.entities,
    });
    await internals.closeDelivery({ tx, deliveryId });
    return { deliveryId };
  } else if (delivery.type === 'delta') {
    const { deliveryId } = await internals.createDelivery({
      tx,
      sourceKey,
      action: 'replace',
    });
    await internals.upsertProviderState({
      tx,
      deliveryId,
      sourceKey,
      deferred: delivery.added,
    });
    const removed = delivery.removed.map(r =>
      'entityRef' in r ? r.entityRef : stringifyEntityRef(r.entity),
    );
    await internals.closeDelivery({ tx, deliveryId });
  }

  throw new Error('unsupported delivery type');
}
