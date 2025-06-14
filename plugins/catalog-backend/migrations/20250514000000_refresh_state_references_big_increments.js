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

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(
      `ALTER TABLE refresh_state_references ALTER COLUMN id TYPE bigint;`,
    );
    await knex.schema.raw(
      `ALTER SEQUENCE refresh_state_references_id_seq AS bigint MAXVALUE 9223372036854775807;`,
    );
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(
      `ALTER TABLE refresh_state_references MODIFY id bigint AUTO_INCREMENT;`,
    );
  }
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.schema.raw(
      `ALTER SEQUENCE refresh_state_references_id_seq AS integer MAXVALUE 2147483647;`,
    );
    await knex.schema.raw(
      `ALTER TABLE refresh_state_references ALTER COLUMN id TYPE integer;`,
    );
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.schema.raw(
      `ALTER TABLE refresh_state_references MODIFY id integer AUTO_INCREMENT;`,
    );
  }
};
