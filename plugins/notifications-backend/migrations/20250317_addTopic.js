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
const crypto = require('crypto');

exports.up = async function up(knex) {
  await knex.schema.alterTable('user_settings', table => {
    table.string('topic').nullable().after('origin');
    table.string('settings_key_hash', 64).notNullable();
    table.dropUnique([], 'user_settings_unique_idx');
  });

  await knex.schema.alterTable('user_settings', table => {
    table.unique(['settings_key_hash'], 'user_settings_unique_idx');
  });

  const rows = await knex('user_settings').select('user', 'channel', 'origin');
  for (const row of rows) {
    const rawKey = `${row.user}|${row.channel}|${row.origin}|}`;
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    await knex('user_settings')
      .where({
        user: row.user,
        channel: row.channel,
        origin: row.origin,
        topic: row.topic,
      })
      .update({ settings_key_hash: hash });
  }
};

exports.down = async function down(knex) {
  await knex.schema.table('user_settings', table => {
    table.dropUnique([], 'user_settings_unique_idx');
    table.dropColumn('settings_key_hash');
    table.dropColumn('topic');
  });

  await knex.schema.alterTable('user_settings', table => {
    table.unique(['user', 'channel', 'origin'], {
      indexName: 'user_settings_unique_idx',
    });
  });
};
