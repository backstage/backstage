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
   * type of history thing. This rolls up all types of event, such that e.g. a
   * change event followed by a deletion followed by the creation of a new
   * entity with the same ref but a different UID, will only be seen as a single
   * creation if you are polling this table for the entity ref type.
   */

  await knex.schema.createTable('history_summary', table => {
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

    table.primary(['ref_type', 'ref_value']);
    table.index('event_id', 'history_summary_event_id_idx');
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
          INSERT INTO history_summary (ref_type, ref_value, event_id)
          VALUES ('entity_ref', NEW.entity_ref, NEW.event_id)
          ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
        END IF;
        IF (NEW.entity_id IS NOT NULL) THEN
          INSERT INTO history_summary (ref_type, ref_value, event_id)
          VALUES ('entity_id', NEW.entity_id, NEW.event_id)
          ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
        END IF;
        IF (NEW.location_id IS NOT NULL) THEN
          INSERT INTO history_summary (ref_type, ref_value, event_id)
          VALUES ('location_id', NEW.location_id, NEW.event_id)
          ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
        END IF;
        IF (NEW.location_ref_before IS NOT NULL) THEN
          INSERT INTO history_summary (ref_type, ref_value, event_id)
          VALUES ('location_ref', NEW.location_ref_before, NEW.event_id)
          ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
        END IF;
        IF (NEW.location_ref IS NOT NULL) THEN
          INSERT INTO history_summary (ref_type, ref_value, event_id)
          VALUES ('location_ref', NEW.location_ref, NEW.event_id)
          ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = GREATEST(history_summary.event_id, EXCLUDED.event_id);
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
      CREATE TRIGGER history_events_summary_entity_ref
      AFTER INSERT ON history_events
      FOR EACH ROW
      WHEN (NEW.entity_ref IS NOT NULL)
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('entity_ref', NEW.entity_ref, NEW.event_id)
        ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = MAX(history_summary.event_id, NEW.event_id);
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_entity_id
      AFTER INSERT ON history_events
      FOR EACH ROW
      WHEN (NEW.entity_id IS NOT NULL)
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('entity_id', NEW.entity_id, NEW.event_id)
        ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = MAX(history_summary.event_id, NEW.event_id);
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_id
      AFTER INSERT ON history_events
      FOR EACH ROW
      WHEN (NEW.location_id IS NOT NULL)
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_id', NEW.location_id, NEW.event_id)
        ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = MAX(history_summary.event_id, NEW.event_id);
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_ref_before
      AFTER INSERT ON history_events
      FOR EACH ROW
      WHEN (NEW.location_ref_before IS NOT NULL)
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_ref', NEW.location_ref_before, NEW.event_id)
        ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = MAX(history_summary.event_id, NEW.event_id);
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_ref
      AFTER INSERT ON history_events
      FOR EACH ROW
      WHEN (NEW.location_ref IS NOT NULL)
      BEGIN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_ref', NEW.location_ref, NEW.event_id)
        ON CONFLICT (ref_type, ref_value) DO UPDATE SET event_id = MAX(history_summary.event_id, NEW.event_id);
      END;
    `);
  }

  /*
   * MySQL triggers
   */

  if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_entity_ref
      AFTER INSERT ON history_events
      FOR EACH ROW
      IF (NEW.entity_ref IS NOT NULL) THEN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('entity_ref', NEW.entity_ref, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_entity_id
      AFTER INSERT ON history_events
      FOR EACH ROW
      IF (NEW.entity_id IS NOT NULL) THEN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('entity_id', NEW.entity_id, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_id
      AFTER INSERT ON history_events
      FOR EACH ROW
      IF (NEW.location_id IS NOT NULL) THEN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_id', NEW.location_id, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_ref_before
      AFTER INSERT ON history_events
      FOR EACH ROW
      IF (NEW.location_ref_before IS NOT NULL) THEN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_ref', NEW.location_ref_before, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER history_events_summary_location_ref
      AFTER INSERT ON history_events
      FOR EACH ROW
      IF (NEW.location_ref IS NOT NULL) THEN
        INSERT INTO history_summary (ref_type, ref_value, event_id)
        VALUES ('location_ref', NEW.location_ref, NEW.event_id)
        ON DUPLICATE KEY UPDATE event_id = GREATEST(history_summary.event_id, VALUES(event_id));
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
      DROP TRIGGER history_events_summary_entity_ref;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_entity_id;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_id;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_ref_before;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_ref;
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_entity_ref;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_entity_id;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_id;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_ref_before;
    `);
    await knex.schema.raw(`
      DROP TRIGGER history_events_summary_location_ref;
    `);
  }
  await knex.schema.dropTable('history_summary');
};
