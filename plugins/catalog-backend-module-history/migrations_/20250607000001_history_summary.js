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
   * Entity summary table, keeping track of the latest history state of each
   * entity. This rolls up all types of event, such that e.g. a change event
   * followed by a deletion followed by the creation of a new entity with the
   * same ref but a different UID, will only be seen as a single creation if
   * you are polling this table.
   */

  await knex.schema.createTable('history_entity_summary', table => {
    // Note that this deliberately does not foreign key into final_entities,
    // because we want to retain summary entries even after deletions. This
    // allows consumers to detect deletion events later down the line.
    table
      .string('entity_ref')
      .notNullable()
      .primary()
      .comment('The relevant entity ref');
    table
      .bigInteger('event_id')
      .unsigned()
      .notNullable()
      .references('event_id')
      .inTable('history_events')
      .comment('ID of the latest history event for this entity');
    table.index('event_id', 'history_entity_summary_event_id_idx');
  });

  /*
   * Postgres triggers
   */

  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(`
      CREATE FUNCTION history_events_summary()
      RETURNS trigger AS $$
      BEGIN
        IF (NEW.entity_ref IS NOT NULL) THEN
          INSERT INTO history_entity_summary (entity_ref, event_id)
          VALUES (NEW.entity_ref, NEW.event_id)
          ON CONFLICT (entity_ref) DO UPDATE SET event_id = GREATEST(history_entity_summary.event_id, EXCLUDED.event_id);
        END IF;
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
      WHEN (NEW.entity_ref IS NOT NULL)
      BEGIN
        INSERT INTO history_entity_summary (entity_ref, event_id)
        VALUES (NEW.entity_ref, NEW.event_id)
        ON CONFLICT (entity_ref) DO UPDATE SET event_id = MAX(history_entity_summary.event_id, NEW.event_id);
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
      IF (NEW.entity_ref IS NOT NULL) THEN
        INSERT INTO history_entity_summary (entity_ref, event_id)
        VALUES (NEW.entity_ref, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_entity_summary.event_id, VALUES(event_id));
      END IF;
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
  await knex.schema.alterTable('history_entity_summary', table => {
    table.dropForeign('event_id');
    table.dropIndex([], 'history_entity_summary_event_id_idx');
  });
  await knex.schema.dropTable('history_entity_summary');
};
