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
  await knex.schema.createTable('module_history__events', table => {
    table
      .bigIncrements('id')
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
      .text('entity_json', 'longtext')
      .nullable()
      .comment('The body of the affected entity, where applicable');
  });

  await knex.schema.createTable('module_history__subscriptions', table => {
    table.string('id').primary().comment('Unique ID of the event subscription');
    table
      .string('consumer_name')
      .notNullable()
      .comment('The name of the consumer that subscribed');
    table
      .dateTime('updated_at')
      .notNullable()
      .comment('When the subscription was last updated');
    table
      .bigInteger('last_event_id')
      .comment('Last event ID successfully consumed');
  });

  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(
      `
      CREATE FUNCTION final_entities_change_history()
      RETURNS trigger AS $$
      DECLARE
        event_type TEXT;
        entity_json TEXT;
      BEGIN
        IF (TG_OP = 'INSERT') THEN
          -- Before first stitch completes, an entry is made with a null final_entity.
          -- We still capture INSERT triggers desipte that, just to cover for the case
          -- if this behavior changes some time down the line.
          IF (NEW.final_entity IS NULL) THEN
            RETURN null;
          END IF;
          event_type = 'entity_inserted';
          entity_json = NEW.final_entity;
        ELSIF (TG_OP = 'UPDATE') THEN
          IF (OLD.final_entity IS NULL) THEN
            -- Before first stitch completes, an entry is made with a null final_entity.
            event_type = 'entity_inserted';
          ELSIF (OLD.final_entity IS DISTINCT FROM NEW.final_entity) THEN
            event_type = 'entity_updated';
          ELSE
            RETURN null;
          END IF;
          entity_json = NEW.final_entity;
        ELSIF (TG_OP = 'DELETE') THEN
          event_type = 'entity_deleted';
          entity_json = OLD.final_entity;
        ELSE
          RETURN null;
        END IF;

        INSERT INTO module_history__events (event_at, event_type, entity_ref, entity_json) VALUES (
          CURRENT_TIMESTAMP,
          event_type,
          lower(
            (entity_json::json->>'kind') || ':' ||
            (entity_json::json->'metadata'->>'namespace') || '/' ||
            (entity_json::json->'metadata'->>'name')
          ),
          entity_json
        );

        RETURN null;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER final_entities_change_history
      AFTER INSERT OR DELETE OR UPDATE OF final_entity ON final_entities
      FOR EACH ROW EXECUTE PROCEDURE final_entities_change_history();
      `,
    );
  } else if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(
      `
      CREATE TRIGGER final_entities_change_history_inserted
      AFTER INSERT ON final_entities
      FOR EACH ROW
      WHEN (NEW.final_entity IS NOT NULL)
      BEGIN
        INSERT INTO module_history__events (event_at, event_type, entity_ref, entity_json) VALUES (
          CURRENT_TIMESTAMP,
          'entity_inserted',
          lower(
            (NEW.final_entity->>'kind') || ':' ||
            (NEW.final_entity->'metadata'->>'namespace') || '/' ||
            (NEW.final_entity->'metadata'->>'name')
          ),
          NEW.final_entity
        );
      END;
      `,
    );
    await knex.schema.raw(
      `
      CREATE TRIGGER final_entities_change_history_updated
      AFTER UPDATE OF final_entity ON final_entities
      FOR EACH ROW
      BEGIN
        INSERT INTO module_history__events (event_at, event_type, entity_ref, entity_json) VALUES (
          CURRENT_TIMESTAMP,
          CASE WHEN (OLD.final_entity IS NULL) THEN 'entity_inserted' ELSE 'entity_updated' END,
          lower(
            (NEW.final_entity->>'kind') || ':' ||
            (NEW.final_entity->'metadata'->>'namespace') || '/' ||
            (NEW.final_entity->'metadata'->>'name')
          ),
          NEW.final_entity
        );
      END;
      `,
    );
    await knex.schema.raw(
      `
      CREATE TRIGGER final_entities_change_history_deleted
      AFTER DELETE ON final_entities
      FOR EACH ROW
      BEGIN
        INSERT INTO module_history__events (event_at, event_type, entity_ref, entity_json) VALUES (
          CURRENT_TIMESTAMP,
          'entity_deleted',
          lower(
            (OLD.final_entity->>'kind') || ':' ||
            (OLD.final_entity->'metadata'->>'namespace') || '/' ||
            (OLD.final_entity->'metadata'->>'name')
          ),
          OLD.final_entity
        );
      END;
      `,
    );
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(
      `
    DROP TRIGGER final_entities_change_history ON final_entities;
    DROP FUNCTION final_entities_change_history();
    `,
    );
  } else if (knex.client.config.client.includes('sqlite')) {
    await knex.schema.raw(
      `DROP TRIGGER final_entities_change_history_inserted;`,
    );
    await knex.schema.raw(
      `DROP TRIGGER final_entities_change_history_updated;`,
    );
    await knex.schema.raw(
      `DROP TRIGGER final_entities_change_history_deleted;`,
    );
  }
  await knex.schema.dropTable('module_history__subscriptions');
  await knex.schema.dropTable('module_history__events');
};
