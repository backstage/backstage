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
   * Events table
   */

  await knex.schema.createTable('history_events', table => {
    table
      .bigIncrements('event_id')
      .primary()
      .comment('Unique sequential ID of the event');
    table
      .dateTime('event_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('When the event happened');
    table.string('event_type').notNullable().comment('The type of event');
    table
      .string('entity_ref')
      .nullable()
      .comment('Affected entity ref, where applicable');
    table
      .string('entity_id')
      .nullable()
      .comment('Affected entity uid, where applicable');
    table
      .text('entity_json_before', 'longtext')
      .nullable()
      .comment(
        'The body of the affected entity before the change, where applicable (for updates only)',
      );
    table
      .text('entity_json', 'longtext')
      .nullable()
      .comment('The body of the affected entity, where applicable');
    table
      .string('location_id')
      .nullable()
      .comment('The registered location ID affected, where applicable');
    table
      .string('location_ref_before')
      .nullable()
      .comment(
        'The location affected before the change, where applicable (for updates only)',
      );
    table
      .string('location_ref')
      .nullable()
      .comment('The location affected, where applicable');
  });

  /*
   * Postgres triggers
   */

  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(`
      CREATE FUNCTION final_entities_history()
      RETURNS trigger AS $$
      DECLARE
        event_type TEXT;
        entity_ref TEXT;
        entity_id TEXT;
        entity_json_before TEXT;
        entity_json TEXT;
        location_ref_before TEXT;
        location_ref TEXT;
      BEGIN

        IF (TG_OP = 'INSERT') THEN
          IF (NEW.final_entity IS NOT NULL) THEN
            event_type = 'entity_created';
          ELSE
            RETURN null;
          END IF;
          entity_ref = NEW.entity_ref;
          entity_id = NEW.entity_id;
          entity_json = NEW.final_entity;
          location_ref = NEW.final_entity::json->'metadata'->'annotations'->>'backstage.io/managed-by-location';

        ELSIF (TG_OP = 'UPDATE') THEN
          IF (OLD.final_entity IS NULL AND NEW.final_entity IS NOT NULL) THEN
            event_type = 'entity_created';
          ELSIF (OLD.final_entity IS NOT NULL AND NEW.final_entity IS NOT NULL AND OLD.final_entity <> NEW.final_entity) THEN
            event_type = 'entity_updated';
          ELSIF (OLD.final_entity IS NOT NULL AND NEW.final_entity IS NULL) THEN
            event_type = 'entity_deleted';
          ELSE
            RETURN null;
          END IF;
          entity_ref = NEW.entity_ref;
          entity_id = NEW.entity_id;
          entity_json_before = OLD.final_entity;
          entity_json = NEW.final_entity;
          location_ref_before = OLD.final_entity::json->'metadata'->'annotations'->>'backstage.io/managed-by-location';
          location_ref = NEW.final_entity::json->'metadata'->'annotations'->>'backstage.io/managed-by-location';

        ELSIF (TG_OP = 'DELETE') THEN
          IF (OLD.final_entity IS NOT NULL) THEN
            event_type = 'entity_deleted';
          ELSE
            RETURN null;
          END IF;
          entity_ref = OLD.entity_ref;
          entity_id = OLD.entity_id;
          entity_json = OLD.final_entity;
          location_ref = OLD.final_entity::json->'metadata'->'annotations'->>'backstage.io/managed-by-location';

        ELSE
          RETURN null;
        END IF;

        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json_before, entity_json, location_ref_before, location_ref) VALUES (
          event_type,
          entity_ref,
          entity_id,
          entity_json_before,
          entity_json,
          location_ref_before,
          location_ref
        );

        PERFORM PG_NOTIFY('event_bus_publish', 'history_event_created');

        RETURN null;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history
      AFTER INSERT OR DELETE OR UPDATE OF final_entity ON final_entities
      FOR EACH ROW EXECUTE PROCEDURE final_entities_history();
    `);
    await knex.schema.raw(`
      CREATE FUNCTION locations_history()
      RETURNS trigger AS $$
      BEGIN

        IF (TG_OP = 'INSERT') THEN
          INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
            'location_created',
            NEW.id,
            CONCAT(NEW.type, ':', NEW.target)
          );

        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO history_events (event_type, location_id, location_ref_before, location_ref) VALUES (
            'location_updated',
            NEW.id,
            CONCAT(OLD.type, ':', OLD.target),
            CONCAT(NEW.type, ':', NEW.target)
          );

        ELSIF (TG_OP = 'DELETE') THEN
          INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
            'location_deleted',
            OLD.id,
            CONCAT(OLD.type, ':', OLD.target)
          );

        END IF;
        RETURN null;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history
      AFTER INSERT OR DELETE OR UPDATE ON locations
      FOR EACH ROW EXECUTE PROCEDURE locations_history();
    `);
  }

  /*
   * SQLite triggers
   */

  if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_created
      AFTER INSERT ON final_entities
      FOR EACH ROW
      WHEN (NEW.final_entity IS NOT NULL)
      BEGIN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json, location_ref) VALUES (
          'entity_created',
          NEW.entity_ref,
          NEW.entity_id,
          NEW.final_entity,
          json_extract(NEW.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_updated
      AFTER UPDATE OF final_entity ON final_entities
      FOR EACH ROW
      BEGIN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json_before, entity_json, location_ref_before, location_ref) VALUES (
          CASE
            WHEN (OLD.final_entity IS NULL) THEN 'entity_created'
            WHEN (NEW.final_entity IS NULL) THEN 'entity_deleted'
            ELSE 'entity_updated'
          END,
          NEW.entity_ref,
          NEW.entity_id,
          OLD.final_entity,
          NEW.final_entity,
          json_extract(OLD.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"'),
          json_extract(NEW.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_deleted
      AFTER DELETE ON final_entities
      FOR EACH ROW
      WHEN (OLD.final_entity IS NOT NULL)
      BEGIN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json, location_ref) VALUES (
          'entity_deleted',
          OLD.entity_ref,
          OLD.entity_id,
          OLD.final_entity,
          json_extract(OLD.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END;
    `);

    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_created
      AFTER INSERT ON locations
      FOR EACH ROW
      BEGIN
        INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
          'location_created',
          NEW.id,
          CONCAT(NEW.type, ':', NEW.target)
        );
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_updated
      AFTER UPDATE ON locations
      FOR EACH ROW
      BEGIN
        INSERT INTO history_events (event_type, location_id, location_ref_before, location_ref) VALUES (
          'location_updated',
          NEW.id,
          CONCAT(OLD.type, ':', OLD.target),
          CONCAT(NEW.type, ':', NEW.target)
        );
      END;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_deleted
      AFTER DELETE ON locations
      FOR EACH ROW
      BEGIN
        INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
          'location_deleted',
          OLD.id,
          CONCAT(OLD.type, ':', OLD.target)
        );
      END;
    `);
  }

  /*
   * MySQL triggers
   */

  if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_created
      AFTER INSERT ON final_entities
      FOR EACH ROW
      IF NEW.final_entity IS NOT NULL THEN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json, location_ref) VALUES (
          'entity_created',
          NEW.entity_ref,
          NEW.entity_id,
          NEW.final_entity,
          json_value(NEW.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_updated
      AFTER UPDATE ON final_entities
      FOR EACH ROW
      IF IFNULL(NEW.final_entity,'') <> IFNULL(OLD.final_entity,'') THEN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json_before, entity_json, location_ref_before, location_ref) VALUES (
          CASE
            WHEN (OLD.final_entity IS NULL) THEN 'entity_created'
            WHEN (NEW.final_entity IS NULL) THEN 'entity_deleted'
            ELSE 'entity_updated'
          END,
          NEW.entity_ref,
          NEW.entity_id,
          OLD.final_entity,
          NEW.final_entity,
          json_value(OLD.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"'),
          json_value(NEW.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END IF;
    `);
    // https://dev.mysql.com/doc/refman/8.4/en/create-trigger.html
    // Since triggers do not get called for foreign key actions,
    // we must implement the cascade in terms of another trigger.
    await knex.schema.raw(`
      CREATE TRIGGER refresh_state_delete_cascade
      BEFORE DELETE ON refresh_state
      FOR EACH ROW
      DELETE FROM final_entities WHERE entity_id = OLD.entity_id;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER final_entities_history_entity_deleted
      AFTER DELETE ON final_entities
      FOR EACH ROW
      IF OLD.final_entity IS NOT NULL THEN
        INSERT INTO history_events (event_type, entity_ref, entity_id, entity_json, location_ref) VALUES (
          'entity_deleted',
          OLD.entity_ref,
          OLD.entity_id,
          OLD.final_entity,
          json_value(OLD.final_entity, '$.metadata.annotations."backstage.io/managed-by-location"')
        );
      END IF;
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_created
      AFTER INSERT ON locations
      FOR EACH ROW
      INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
        'location_created',
        NEW.id,
        CONCAT(NEW.type, ':', NEW.target)
      );
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_updated
      AFTER UPDATE ON locations
      FOR EACH ROW
      INSERT INTO history_events (event_type, location_id, location_ref_before, location_ref) VALUES (
        'location_updated',
        NEW.id,
        CONCAT(OLD.type, ':', OLD.target),
        CONCAT(NEW.type, ':', NEW.target)
      );
    `);
    await knex.schema.raw(`
      CREATE TRIGGER locations_history_location_deleted
      AFTER DELETE ON locations
      FOR EACH ROW
      INSERT INTO history_events (event_type, location_id, location_ref) VALUES (
        'location_deleted',
        OLD.id,
        CONCAT(OLD.type, ':', OLD.target)
      );
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
      DROP TRIGGER final_entities_history ON final_entities;
    `);
    await knex.schema.raw(`
      DROP FUNCTION final_entities_history;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history ON locations;
    `);
    await knex.schema.raw(`
      DROP FUNCTION locations_history;
    `);
  } else if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_created;
    `);
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_updated;
    `);
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_deleted;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_created;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_updated;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_deleted;
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_created;
    `);
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_updated;
    `);
    await knex.schema.raw(`
      DROP TRIGGER refresh_state_delete_cascade;
    `);
    await knex.schema.raw(`
      DROP TRIGGER final_entities_history_entity_deleted;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_created;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_updated;
    `);
    await knex.schema.raw(`
      DROP TRIGGER locations_history_location_deleted;
    `);
  }
  await knex.schema.dropTable('history_events');
};
