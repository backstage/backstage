/*
 * Copyright 2023 The Backstage Authors
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
import { Config } from '@backstage/config';

import knex, { Knex } from 'knex';
import merge from 'lodash/merge';

// initDB
// creates DB client and tables
export async function initDB(dbConfig: Config): Promise<Knex<any, any>> {
  // create db client
  const knexConfig = merge(
    {},
    { connection: { database: 'backstage_plugin_notifications' } },
    dbConfig.get(),
    dbConfig.getOptional('knexConfig'),
  );
  const dbClient = knex(knexConfig);

  // create tables
  if (!(await dbClient.schema.hasTable('messages'))) {
    await dbClient.schema.createTable('messages', table => {
      table.uuid('id', { primaryKey: true }).defaultTo(dbClient.fn.uuid());
      table.string('origin').notNullable();
      table.timestamp('created').defaultTo(dbClient.fn.now()).index();
      table.string('title').notNullable();
      table.text('message');
      table.string('topic');
      table.boolean('is_system').notNullable().index(); // is it a system message or a message for specific users and groups
    });
  }

  if (!(await dbClient.schema.hasTable('users'))) {
    await dbClient.schema.createTable('users', table => {
      table.uuid('message_id').notNullable().index();
      table.string('user').notNullable().index();
      table.boolean('read').defaultTo('false');
      table
        .foreign('message_id')
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE');
      table.primary(['message_id', 'user']);
    });
  }

  if (!(await dbClient.schema.hasTable('groups'))) {
    await dbClient.schema.createTable('groups', table => {
      table.uuid('message_id').notNullable().index();
      table.string('group').notNullable().index();
      table
        .foreign('message_id')
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE');
      table.primary(['message_id', 'group']);
    });
  }

  if (!(await dbClient.schema.hasTable('actions'))) {
    await dbClient.schema.createTable('actions', table => {
      table.uuid('id', { primaryKey: true }).defaultTo(dbClient.fn.uuid());
      table.uuid('message_id').notNullable().index();
      table
        .foreign('message_id')
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE');
      table.string('url').notNullable();
      table.string('title').notNullable();
    });
  }

  return dbClient;
}

export type MessagesInsert = {
  origin: string;
  title: string;
  message?: string;
  topic?: string;
  is_system: boolean;
};

export type ActionsInsert = {
  message_id: string;
  title: string;
  url: string;
};
