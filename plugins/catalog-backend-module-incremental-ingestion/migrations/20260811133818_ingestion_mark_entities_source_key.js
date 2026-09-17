/*
 * Copyright 2026 The Backstage Authors
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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table
      .string('source_key')
      .nullable()
      .comment('The provider name of the ingestion that produced this mark');
  });

  await knex('ingestion_mark_entities').update({
    source_key: knex('ingestions')
      .select('ingestions.provider_name')
      .innerJoin(
        'ingestion_marks',
        'ingestion_marks.ingestion_id',
        'ingestions.id',
      )
      .where(
        'ingestion_marks.id',
        knex.ref('ingestion_mark_entities.ingestion_mark_id'),
      ),
  });

  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table.renameColumn('ref', 'entity_ref');
  });

  // Prior to this migration, `(source_key, entity_ref)` was never enforced
  // to be unique, so pre-existing installations may have duplicate rows.
  // Keep only the row tied to the most recently created mark, breaking ties
  // by the highest `id`.
  await knex.raw(`
    DELETE FROM ingestion_mark_entities WHERE id IN (
      SELECT id FROM (
        SELECT
          ime.id AS id,
          ROW_NUMBER() OVER (
            PARTITION BY ime.source_key, ime.entity_ref
            ORDER BY im.created_at DESC, ime.id DESC
          ) AS rn
        FROM ingestion_mark_entities ime
        JOIN ingestion_marks im ON im.id = ime.ingestion_mark_id
      ) ranked WHERE ranked.rn > 1
    )
  `);

  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table.string('source_key').notNullable().alter();
    table.unique(['source_key', 'entity_ref'], {
      indexName: 'ingestion_mark_entities_source_key_entity_ref_uniq',
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table.dropUnique(
      ['source_key', 'entity_ref'],
      'ingestion_mark_entities_source_key_entity_ref_uniq',
    );
  });

  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table.renameColumn('entity_ref', 'ref');
  });

  await knex.schema.alterTable('ingestion_mark_entities', table => {
    table.dropColumn('source_key');
  });
};
