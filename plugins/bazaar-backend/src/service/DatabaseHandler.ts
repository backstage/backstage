/*
 * Copyright 2021 The Backstage Authors
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

import {
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-bazaar-backend',
  'migrations',
);

type Options = {
  database: PluginDatabaseManager;
};

export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;
    const client = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseHandler(client);
  }

  private readonly client: Knex;

  private constructor(client: Knex) {
    this.client = client;
  }

  private columns = [
    'metadata.id',
    'metadata.entity_ref',
    'metadata.title',
    'metadata.description',
    'metadata.status',
    'metadata.updated_at',
    'metadata.community',
    'metadata.size',
    'metadata.start_date',
    'metadata.end_date',
    'metadata.responsible',
  ];

  async getMembers(id: string) {
    return await this.client.select('*').from('members').where({ item_id: id });
  }

  async addMember(
    id: number,
    userId: string,
    userRef?: string,
    picture?: string,
  ) {
    await this.client
      .insert({
        item_id: id,
        user_id: userId,
        user_ref: userRef,
        picture: picture,
      })
      .into('members');
  }

  async deleteMember(id: number, userId: string) {
    return await this.client('members')
      .where({ item_id: id })
      .andWhere('user_id', userId)
      .del();
  }

  async getMetadataById(id: number) {
    const coalesce = this.client.raw(
      'coalesce(count(members.item_id), 0) as members_count',
    );

    return await this.client('metadata')
      .select([...this.columns, coalesce])
      .where({ 'metadata.id': id })
      .groupBy(this.columns)
      .leftJoin('members', 'metadata.id', '=', 'members.item_id');
  }

  async getMetadataByRef(entityRef: string) {
    const coalesce = this.client.raw(
      'coalesce(count(members.item_id), 0) as members_count',
    );

    return await this.client('metadata')
      .select([...this.columns, coalesce])
      .where({ 'metadata.entity_ref': entityRef })
      .groupBy(this.columns)
      .leftJoin('members', 'metadata.id', '=', 'members.item_id');
  }

  async insertMetadata(bazaarProject: any) {
    const {
      title,
      entityRef,
      community,
      description,
      status,
      size,
      startDate,
      endDate,
      responsible,
    } = bazaarProject;

    await this.client
      .insert({
        title,
        entity_ref: entityRef,
        community,
        description,
        status,
        updated_at: new Date().toISOString(),
        size,
        start_date: startDate,
        end_date: endDate,
        responsible,
      })
      .into('metadata');
  }

  async updateMetadata(bazaarProject: any) {
    const {
      title,
      id,
      entityRef,
      community,
      description,
      status,
      size,
      startDate,
      endDate,
      responsible,
    } = bazaarProject;

    return await this.client('metadata').where({ id: id }).update({
      title,
      entity_ref: entityRef,
      description,
      community,
      status,
      updated_at: new Date().toISOString(),
      size,
      start_date: startDate,
      end_date: endDate,
      responsible,
    });
  }

  async deleteMetadata(id: number) {
    return await this.client('metadata').where({ id: id }).del();
  }

  async getProjects(limit?: number, order?: string) {
    const coalesce = this.client.raw(
      'coalesce(count(members.item_id), 0) as members_count',
    );
    let get = this.client('metadata')
      .select([...this.columns, coalesce])
      .groupBy(this.columns);
    if (limit) {
      get = get.limit(limit);
    }
    if (order === 'latest') {
      get = get.orderByRaw('id desc');
    }
    if (order === 'random') {
      get = get.orderByRaw('RANDOM()');
    }
    return await get.leftJoin('members', 'metadata.id', '=', 'members.item_id');
  }
}
