/*
 * Copyright 2022 The Backstage Authors
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
import type { DeferredEntity } from '@backstage/plugin-catalog-node';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Duration } from 'luxon';
import { randomUUID as v4 } from 'node:crypto';
import {
  IngestionRecord,
  IngestionRecordUpdate,
  IngestionUpsert,
  MarkRecord,
  MarkRecordInsert,
} from './tables';

export class IncrementalIngestionDatabaseManager {
  private client: Knex;

  constructor(options: { client: Knex }) {
    this.client = options.client;
  }

  private whereInArray(column: string, values: string[]) {
    const isPg = this.client.client.config.client === 'pg';
    return (qb: Knex.QueryBuilder) => {
      if (isPg) {
        qb.whereRaw('?? = ANY(?)', [column, values]);
      } else {
        qb.whereIn(column, values);
      }
    };
  }

  /**
   * Performs an update to the ingestion record with matching `id`.
   * @param options - IngestionRecordUpdate
   */
  async updateIngestionRecordById(options: IngestionRecordUpdate) {
    await this.client.transaction(async tx => {
      const { ingestionId, update } = options;
      await tx('ingestions').where('id', ingestionId).update(update);
    });
  }

  /**
   * Performs an update to the ingestion record with matching provider name. Will only update active records.
   * @param provider - string
   * @param update - Partial<IngestionUpsertIFace>
   */
  async updateIngestionRecordByProvider(
    provider: string,
    update: Partial<IngestionUpsert>,
  ) {
    await this.client.transaction(async tx => {
      await tx('ingestions')
        .where('provider_name', provider)
        .andWhere('completion_ticket', 'open')
        .update(update);
    });
  }

  /**
   * Performs an insert into the `ingestions` table with the supplied values.
   * @param record - IngestionUpsertIFace
   */
  async insertIngestionRecord(record: IngestionUpsert) {
    await this.client.transaction(async tx => {
      await tx('ingestions').insert(record);
    });
  }

  private async deleteMarkEntities(
    tx: Knex.Transaction,
    ids: { id: string }[],
  ) {
    if (ids.length === 0) {
      return 0;
    }

    const allIds = ids.map(entry => entry.id);

    if (this.client.client.config.client === 'pg') {
      return await tx('ingestion_mark_entities')
        .delete()
        .modify(this.whereInArray('id', allIds));
    }

    let deleted = 0;
    for (let i = 0; i < allIds.length; i += 100) {
      const chunk = allIds.slice(i, i + 100);
      deleted += await tx('ingestion_mark_entities')
        .delete()
        .whereIn('id', chunk);
    }
    return deleted;
  }

  /**
   * Finds the current ingestion record for the named provider.
   * @param provider - string
   * @returns IngestionRecord | undefined
   */
  async getCurrentIngestionRecord(provider: string) {
    return await this.client.transaction(async tx => {
      const record = await tx<IngestionRecord>('ingestions')
        .where('provider_name', provider)
        .andWhere('completion_ticket', 'open')
        .first();
      return record;
    });
  }

  /**
   * Removes all entries from `ingestion_marks_entities`, `ingestion_marks`, and `ingestions`
   * for prior ingestions that completed (i.e., have a `completion_ticket` value other than 'open').
   * @param provider - string
   * @returns A count of deletions for each record type.
   */
  async clearFinishedIngestions(provider: string) {
    return await this.client.transaction(async tx => {
      const markEntitiesDeleted = await tx('ingestion_mark_entities')
        .delete()
        .whereIn(
          'ingestion_mark_id',
          tx('ingestion_marks')
            .select('id')
            .whereIn(
              'ingestion_id',
              tx('ingestions')
                .select('id')
                .where('provider_name', provider)
                .andWhereNot('completion_ticket', 'open'),
            ),
        );

      const marksDeleted = await tx('ingestion_marks')
        .delete()
        .whereIn(
          'ingestion_id',
          tx('ingestions')
            .select('id')
            .where('provider_name', provider)
            .andWhereNot('completion_ticket', 'open'),
        );

      const ingestionsDeleted = await tx('ingestions')
        .delete()
        .where('provider_name', provider)
        .andWhereNot('completion_ticket', 'open');

      return {
        deletions: {
          markEntitiesDeleted,
          marksDeleted,
          ingestionsDeleted,
        },
      };
    });
  }

  /**
   * This method fully purges and resets all ingestion records for the named provider, and
   * leaves it in a paused state.
   * @param provider - string
   * @returns Counts of all deleted ingestion records
   */
  async purgeAndResetProvider(provider: string) {
    return await this.client.transaction(async tx => {
      const ingestionIDs: { id: string }[] = await tx('ingestions')
        .select('id')
        .where('provider_name', provider);

      const markIDs: { id: string }[] =
        ingestionIDs.length > 0
          ? await tx('ingestion_marks')
              .select('id')
              .whereIn(
                'ingestion_id',
                ingestionIDs.map(entry => entry.id),
              )
          : [];

      const markEntityIDs: { id: string }[] =
        markIDs.length > 0
          ? await tx('ingestion_mark_entities')
              .select('id')
              .whereIn(
                'ingestion_mark_id',
                markIDs.map(entry => entry.id),
              )
          : [];

      const markEntitiesDeleted = await this.deleteMarkEntities(
        tx,
        markEntityIDs,
      );

      const marksDeleted =
        markIDs.length > 0
          ? await tx('ingestion_marks')
              .delete()
              .whereIn(
                'ingestion_id',
                ingestionIDs.map(entry => entry.id),
              )
          : 0;

      const ingestionsDeleted = await tx('ingestions')
        .delete()
        .where('provider_name', provider);

      const next_action_at = new Date();
      next_action_at.setTime(next_action_at.getTime() + 24 * 60 * 60 * 1000);

      await this.insertIngestionRecord({
        id: v4(),
        next_action: 'rest',
        provider_name: provider,
        next_action_at,
        ingestion_completed_at: new Date(),
        status: 'resting',
        completion_ticket: 'open',
      });

      return { provider, ingestionsDeleted, marksDeleted, markEntitiesDeleted };
    });
  }

  /**
   * Removes entity records by entity reference from `ingestion_mark_entities`,
   * and from `active_entities` for the given provider, in the same transaction.
   */
  async deleteEntityRecordsByRef(
    sourceKey: string,
    entities: { entityRef: string }[],
  ) {
    if (entities.length === 0) {
      return;
    }

    const refs = entities.map(e => e.entityRef);
    await this.client.transaction(async tx => {
      await tx('ingestion_mark_entities')
        .delete()
        .where('source_key', sourceKey)
        .modify(this.whereInArray('entity_ref', refs));

      await tx('active_entities')
        .delete()
        .where('source_key', sourceKey)
        .modify(this.whereInArray('entity_ref', refs));
    });
  }

  /**
   * Creates a new ingestion record.
   * @param provider - string
   * @returns A new ingestion record
   */
  async createProviderIngestionRecord(provider: string) {
    const ingestionId = v4();
    const nextAction = 'ingest';
    try {
      await this.insertIngestionRecord({
        id: ingestionId,
        next_action: nextAction,
        provider_name: provider,
        status: 'bursting',
        completion_ticket: 'open',
      });
      return { ingestionId, nextAction, attempts: 0, nextActionAt: Date.now() };
    } catch (_e) {
      // Creating the ingestion record failed. Return undefined.
      return undefined;
    }
  }

  /**
   * Counts the number of entities marked in this burst.
   * @param ingestionId - string
   * @returns The count of marked entities.
   */
  async countMarkedEntities(ingestionId: string) {
    return await this.client.transaction(async tx => {
      const [{ total }] = await tx('ingestion_mark_entities')
        .count({ total: 'ingestion_mark_entities.entity_ref' })
        .join(
          'ingestion_marks',
          'ingestion_marks.id',
          'ingestion_mark_entities.ingestion_mark_id',
        )
        .join('ingestions', 'ingestions.id', 'ingestion_marks.ingestion_id')
        .where('ingestions.id', ingestionId);

      return Number(total);
    });
  }

  /**
   * Finds entities that belong to the provider in this module's own
   * `active_entities` tally, but were not marked in this burst, meaning
   * they no longer exist in the upstream source.
   * @param sourceKey - string
   * @param ingestionId - string
   * @returns All entities to remove for this burst.
   */
  async findStaleEntities(sourceKey: string, ingestionId: string) {
    return await this.client.transaction(async tx => {
      const currentMarkRefs = tx('ingestion_mark_entities')
        .select('ingestion_mark_entities.entity_ref')
        .join(
          'ingestion_marks',
          'ingestion_marks.id',
          'ingestion_mark_entities.ingestion_mark_id',
        )
        .join('ingestions', 'ingestions.id', 'ingestion_marks.ingestion_id')
        .where('ingestions.id', ingestionId)
        .as('current_mark_refs');

      const stale: { entity_ref: string }[] = await tx('active_entities')
        .select('active_entities.entity_ref')
        .where('active_entities.source_key', sourceKey)
        .leftJoin(
          currentMarkRefs,
          'current_mark_refs.entity_ref',
          'active_entities.entity_ref',
        )
        .whereNull('current_mark_refs.entity_ref');

      return stale.map(row => ({ entityRef: row.entity_ref }));
    });
  }

  /**
   * Performs a lookup of all providers that have duplicate active ingestion records.
   * @returns An array of all duplicate active ingestions
   */
  async healthcheck() {
    return await this.client.transaction(async tx => {
      const records = await tx<{ id: string; provider_name: string }>(
        'ingestions',
      )
        .distinct('id', 'provider_name')
        .where('rest_completed_at', null);
      return records;
    });
  }

  /**
   * Skips any wait time for the next action to run.
   * @param provider - string
   */
  async triggerNextProviderAction(provider: string) {
    await this.updateIngestionRecordByProvider(provider, {
      next_action_at: new Date(),
    });
  }

  /**
   * Purges the following tables:
   * * `ingestions`
   * * `ingestion_marks`
   * * `ingestion_mark_entities`
   *
   * This function leaves the ingestions table with all providers in a paused state.
   * @returns Results from cleaning up all ingestion tables.
   */
  async cleanupProviders() {
    const providers = await this.listProviders();

    const ingestionsDeleted = await this.purgeTable('ingestions');

    const next_action_at = new Date();
    next_action_at.setTime(next_action_at.getTime() + 24 * 60 * 60 * 1000);

    for (const provider of providers) {
      await this.insertIngestionRecord({
        id: v4(),
        next_action: 'rest',
        provider_name: provider,
        next_action_at,
        ingestion_completed_at: new Date(),
        status: 'resting',
        completion_ticket: 'open',
      });
    }

    const ingestionMarksDeleted = await this.purgeTable('ingestion_marks');
    const markEntitiesDeleted = await this.purgeTable(
      'ingestion_mark_entities',
    );

    return { ingestionsDeleted, ingestionMarksDeleted, markEntitiesDeleted };
  }

  /**
   * Configures the current ingestion record to ingest a burst.
   * @param ingestionId - string
   */
  async setProviderIngesting(ingestionId: string) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: { next_action: 'ingest' },
    });
  }

  /**
   * Indicates the provider is currently ingesting a burst.
   * @param ingestionId - string
   */
  async setProviderBursting(ingestionId: string) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: { status: 'bursting' },
    });
  }

  /**
   * Finalizes the current ingestion record to indicate that the post-ingestion rest period is complete.
   * @param ingestionId - string
   */
  async setProviderComplete(ingestionId: string) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: {
        next_action: 'nothing (done)',
        rest_completed_at: new Date(),
        status: 'complete',
        completion_ticket: v4(),
      },
    });
  }

  /**
   * Marks ingestion as complete and starts the post-ingestion rest cycle.
   * @param ingestionId - string
   * @param restLength - Duration
   */
  async setProviderResting(ingestionId: string, restLength: Duration) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: {
        next_action: 'rest',
        next_action_at: new Date(Date.now() + restLength.as('milliseconds')),
        ingestion_completed_at: new Date(),
        status: 'resting',
      },
    });
  }

  /**
   * Marks ingestion as paused after a burst completes.
   * @param ingestionId - string
   */
  async setProviderInterstitial(ingestionId: string) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: { attempts: 0, status: 'interstitial' },
    });
  }

  /**
   * Starts the cancel process for the current ingestion.
   * @param ingestionId - string
   * @param message - string (optional)
   */
  async setProviderCanceling(ingestionId: string, message?: string) {
    const update: Partial<IngestionUpsert> = {
      next_action: 'cancel',
      last_error: message ? message : undefined,
      next_action_at: new Date(),
      status: 'canceling',
    };
    await this.updateIngestionRecordById({ ingestionId, update });
  }

  /**
   * Completes the cancel process and triggers a new ingestion.
   * @param ingestionId - string
   */
  async setProviderCanceled(ingestionId: string) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: {
        next_action: 'nothing (canceled)',
        rest_completed_at: new Date(),
        status: 'complete',
        completion_ticket: v4(),
      },
    });
  }

  /**
   * Configures the current ingestion to wait and retry, due to a data source error.
   * @param ingestionId - string
   * @param attempts - number
   * @param error - Error
   * @param backoffLength - number
   */
  async setProviderBackoff(
    ingestionId: string,
    attempts: number,
    error: Error,
    backoffLength: number,
  ) {
    await this.updateIngestionRecordById({
      ingestionId,
      update: {
        next_action: 'backoff',
        attempts: attempts + 1,
        last_error: String(error),
        next_action_at: new Date(Date.now() + backoffLength),
        status: 'backing off',
      },
    });
  }

  /**
   * Returns the last record from `ingestion_marks` for the supplied ingestionId.
   * @param ingestionId - string
   * @returns MarkRecord | undefined
   */
  async getLastMark(ingestionId: string) {
    return await this.client.transaction(async tx => {
      const mark = await tx<MarkRecord>('ingestion_marks')
        .where('ingestion_id', ingestionId)
        .orderBy('sequence', 'desc')
        .first();
      return this.#decodeMark(this.client, mark);
    });
  }

  /**
   * Returns the first record from `ingestion_marks` for the supplied ingestionId.
   * @param ingestionId - string
   * @returns MarkRecord | undefined
   */
  async getFirstMark(ingestionId: string) {
    return await this.client.transaction(async tx => {
      const mark = await tx<MarkRecord>('ingestion_marks')
        .where('ingestion_id', ingestionId)
        .orderBy('sequence', 'asc')
        .first();
      return this.#decodeMark(this.client, mark);
    });
  }

  async getAllMarks(ingestionId: string) {
    return await this.client.transaction(async tx => {
      const marks = await tx<MarkRecord>('ingestion_marks')
        .where('ingestion_id', ingestionId)
        .orderBy('sequence', 'desc');
      return marks.map(m => this.#decodeMark(this.client, m));
    });
  }

  /**
   * Performs an insert into the `ingestion_marks` table with the supplied values.
   * @param options - MarkRecordInsert
   */
  async createMark(options: MarkRecordInsert) {
    const { record } = options;
    await this.client.transaction(async tx => {
      await tx('ingestion_marks').insert(record);
    });
  }

  // Handles the fact that sqlite does not support json columns; they just
  // persist the stringified data instead
  #decodeMark<T extends MarkRecord | undefined>(knex: Knex, record: T): T {
    if (record && knex.client.config.client.includes('sqlite3')) {
      return {
        ...record,
        cursor: JSON.parse(record.cursor as string),
      };
    }
    return record;
  }

  /**
   * Performs an upsert to the `ingestion_mark_entities` table for all deferred
   * entities, and inserts the same refs into `active_entities` for the given
   * provider.
   * @param sourceKey - string
   * @param entities - DeferredEntity[]
   * @param markId - string
   */
  async createMarkEntities(
    sourceKey: string,
    entities: DeferredEntity[],
    markId: string,
  ) {
    if (entities.length === 0) {
      return;
    }

    const refs = entities.map(e => stringifyEntityRef(e.entity));

    await this.client.transaction(async tx => {
      await tx('ingestion_mark_entities')
        .insert(
          refs.map(entityRef => ({
            id: v4(),
            ingestion_mark_id: markId,
            source_key: sourceKey,
            entity_ref: entityRef,
          })),
        )
        .onConflict(['source_key', 'entity_ref'])
        .merge(['ingestion_mark_id']);

      await tx('active_entities')
        .insert(refs.map(ref => ({ source_key: sourceKey, entity_ref: ref })))
        .onConflict(['source_key', 'entity_ref'])
        .ignore();
    });
  }

  /**
   * Deletes the entire content of a table, and returns the number of records deleted.
   * @param table - string
   * @returns number
   */
  async purgeTable(table: string) {
    return await this.client.transaction(async tx => {
      return await tx(table).delete();
    });
  }

  /**
   * Returns a list of all providers.
   * @returns string[]
   */
  async listProviders() {
    return await this.client.transaction(async tx => {
      const providers = await tx<{ provider_name: string }>(
        'ingestions',
      ).distinct('provider_name');
      return providers.map(entry => entry.provider_name);
    });
  }

  async updateByName(provider: string, update: Partial<IngestionUpsert>) {
    await this.updateIngestionRecordByProvider(provider, update);
  }
}
