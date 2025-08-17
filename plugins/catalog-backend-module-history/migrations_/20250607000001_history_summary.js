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

// @ts-check

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  /*
   * Summary table, keeping track of the latest history state of each different
   * type of history thing.
   *
   * This rolls up all types of event, such that e.g. a change event followed by
   * a deletion followed by the creation of a new entity with the same ref but a
   * different UID, will only be seen as a single creation if you are polling
   * this table for the entity ref type.
   *
   * The uniqueness constraint is on a reference type and a reference value,
   * such that you can have a summary for e.g. "entity_ref" +
   * "component:default/foo" but also at the same time for "entity_id" +
   * "123". This lets consumers track deltas based on any number of constraints
   * that suit their model.
   *
   * Each summary row has an autoincrementing ID as well. This ensures that any
   * newly added summaries are at the end of the table when sorted by ID.
   * Without this, it would not be possible to safely paginate through the table
   * while it was undergiong changes, without risking to miss deltas for new
   * additions.
   */

  await knex.schema.createTable('history_summary', table => {
    table
      .bigIncrements('summary_id')
      .primary()
      .comment('Unique sequential ID of the summary entry');

    table
      .string('ref_type')
      .comment('The type of the reference, e.g. "entity_ref" or "entity_id"');
    table
      .string('ref_value')
      .comment('The value of the reference, e.g. an entity ref');

    table
      .bigInteger('event_id')
      .unsigned()
      .notNullable()
      .references('event_id')
      .inTable('history_events')
      .comment('ID of the latest history event for this summary row');

    table.index('event_id', 'history_summary_event_id_idx');
  });

  await knex.schema.alterTable('history_summary', table => {
    table.unique(['ref_type', 'ref_value'], {
      useConstraint: true,
      indexName: 'history_summary_ref_uniq',
    });
  });

  /*
   * Postgres triggers
   */

  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(`
      CREATE FUNCTION history_events_summary()
      RETURNS trigger AS $$
      BEGIN
        WITH
          entries (ref_type, ref_value, event_id) AS (
            VALUES
              ('entity_id', NEW.entity_id, NEW.event_id),
              ('entity_ref', NEW.entity_ref, NEW.event_id),
              ('location_id', NEW.location_id, NEW.event_id),
              ('location_ref', NEW.location_ref, NEW.event_id),
              ('location_ref', NEW.location_ref_before, NEW.event_id)
          )
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        SELECT DISTINCT *
          FROM entries
          WHERE entries.ref_value IS NOT NULL
        ON CONFLICT (ref_type, ref_value) DO UPDATE
          SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
        RETURN null;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary
      AFTER INSERT ON history_events
      FOR EACH ROW EXECUTE PROCEDURE history_events_summary();
    `);
  }

  /*
   * SQLite triggers
   */

  if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary
      AFTER INSERT ON history_events
      FOR EACH ROW
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        SELECT DISTINCT * FROM (
          SELECT 'entity_id' ref_type, NEW.entity_id ref_value, NEW.event_id event_id
          UNION ALL
          SELECT 'entity_ref', NEW.entity_ref ref_value, NEW.event_id
          UNION ALL
          SELECT 'location_id', NEW.location_id, NEW.event_id
          UNION ALL
          SELECT 'location_ref', NEW.location_ref, NEW.event_id
          UNION ALL
          SELECT 'location_ref', NEW.location_ref_before, NEW.event_id
        )
        WHERE ref_value IS NOT NULL
        ON CONFLICT (ref_type, ref_value) DO UPDATE
          SET event_id = MAX(history_summary.event_id, EXCLUDED.event_id);
      END;
    `);
  }

  /*
   * MySQL triggers
   */

  if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary
      AFTER INSERT ON history_events
      FOR EACH ROW
      INSERT INTO history_summary (ref_type, ref_value, event_id)
      SELECT DISTINCT * FROM (
        SELECT 'entity_id' AS ref_type, NEW.entity_id AS ref_value, NEW.event_id AS event_id
        UNION ALL
        SELECT 'entity_ref', NEW.entity_ref, NEW.event_id
        UNION ALL
        SELECT 'location_id', NEW.location_id, NEW.event_id
        UNION ALL
        SELECT 'location_ref', NEW.location_ref, NEW.event_id
        UNION ALL
        SELECT 'location_ref', NEW.location_ref_before, NEW.event_id
      ) entries
      WHERE entries.ref_value IS NOT NULL
      ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
    `);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary ON history_events;
    `);
    await knex.schema.raw(`
      DROP FUNCTION history_events_summary;
    `);
  } else if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary;
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary;
    `);
  }
  await knex.schema.dropTable('history_summary');
};
