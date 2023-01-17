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
import type { DeferredEntity } from '@backstage/plugin-catalog-backend';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Duration } from 'luxon';
import { v4 } from 'uuid';
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
    const chunks: { id: string }[][] = [];
    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      chunks.push(chunk);
    }

    let deleted = 0;

    for (const chunk of chunks) {
      const chunkDeleted = await tx('ingestion_mark_entities')
        .delete()
        .whereIn(
          'id',
          chunk.map(entry => entry.id),
        );
      deleted += chunkDeleted;
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
   * Finds the last ingestion record for the named provider.
   * @param provider - string
   * @returns IngestionRecord | undefined
   */
  async getPreviousIngestionRecord(provider: string) {
    return await this.client.transaction(async tx => {
      return await tx<IngestionRecord>('ingestions')
        .where('provider_name', provider)
        .andWhereNot('completion_ticket', 'open')
        .first();
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
   * Automatically cleans up duplicate ingestion records if they were accidentally created.
   * Any ingestion record where the `rest_completed_at` is null (meaning it is active) AND
   * the ingestionId is incorrect is a duplicate ingestion record.
   * @param ingestionId - string
   * @param provider - string
   */
  async clearDuplicateIngestions(ingestionId: string, provider: string) {
    await this.client.transaction(async tx => {
      const invalid = await tx<IngestionRecord>('ingestions')
        .where('provider_name', provider)
        .andWhere('rest_completed_at', null)
        .andWhereNot('id', ingestionId);

      if (invalid.length > 0) {
        await tx('ingestions').delete().whereIn('id', invalid);
        await tx('ingestion_mark_entities')
          .delete()
          .whereIn(
            'ingestion_mark_id',
            tx('ingestion_marks').select('id').whereIn('ingestion_id', invalid),
          );
        await tx('ingestion_marks').delete().whereIn('ingestion_id', invalid);
      }
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
   * Computes which entities to remove, if any, at the end of a burst.
   * @param provider - string
   * @param ingestionId - string
   * @returns All entities to remove for this burst.
   */
  async computeRemoved(provider: string, ingestionId: string) {
    const previousIngestion = await this.getPreviousIngestionRecord(provider);
    return await this.client.transaction(async tx => {
      const count = await tx('ingestion_mark_entities')
        .count({ total: 'ingestion_mark_entities.ref' })
        .join(
          'ingestion_marks',
          'ingestion_marks.id',
          'ingestion_mark_entities.ingestion_mark_id',
        )
        .join('ingestions', 'ingestions.id', 'ingestion_marks.ingestion_id')
        .where('ingestions.id', ingestionId);

      const total = count.reduce((acc, cur) => acc + (cur.total as number), 0);

      const removed: { entityRef: string }[] = [];
      if (previousIngestion) {
        const stale: { ref: string }[] = await tx('ingestion_mark_entities')
          .select('ingestion_mark_entities.ref')
          .join(
            'ingestion_marks',
            'ingestion_marks.id',
            'ingestion_mark_entities.ingestion_mark_id',
          )
          .join('ingestions', 'ingestions.id', 'ingestion_marks.ingestion_id')
          .where('ingestions.id', previousIngestion.id);

        removed.push(
          ...stale.map(e => {
            return { entityRef: e.ref };
          }),
        );
      }

      return { total, removed };
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
      return mark;
    });
  }

  async getAllMarks(ingestionId: string) {
    return await this.client.transaction(async tx => {
      const marks = await tx<MarkRecord>('ingestion_marks')
        .where('ingestion_id', ingestionId)
        .orderBy('sequence', 'desc');
      return marks;
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
  /**
   * Performs an upsert to the `ingestion_mark_entities` table for all deferred entities.
   * @param markId - string
   * @param entities - DeferredEntity[]
   */
  async createMarkEntities(markId: string, entities: DeferredEntity[]) {
    const refs = entities.map(e => stringifyEntityRef(e.entity));

    await this.client.transaction(async tx => {
      const existingRefsArray = (
        await tx<{ ref: string }>('ingestion_mark_entities')
          .select('ref')
          .whereIn('ref', refs)
      ).map(e => e.ref);

      const existingRefsSet = new Set(existingRefsArray);

      const newRefs = refs.filter(e => !existingRefsSet.has(e));

      await tx('ingestion_mark_entities')
        .update('ingestion_mark_id', markId)
        .whereIn('ref', existingRefsArray);

      if (newRefs.length > 0) {
        await tx('ingestion_mark_entities').insert(
          newRefs.map(ref => ({
            id: v4(),
            ingestion_mark_id: markId,
            ref,
          })),
        );
      }
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
