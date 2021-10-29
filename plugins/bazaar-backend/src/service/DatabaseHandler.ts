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

import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-bazaar-backend',
  'migrations',
);

type Options = {
  database: Knex;
};

export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseHandler(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  async getMembers(entityRef: string) {
    return await this.database
      .select('*')
      .from('members')
      .where({ entity_ref: entityRef });
  }

  async addMember(userId: string, entityRef: string, picture?: string) {
    await this.database
      .insert({
        entity_ref: entityRef,
        user_id: userId,
        picture: picture,
      })
      .into('members');
  }

  async deleteMember(userId: string, entityRef: string) {
    return await this.database('members')
      .where({ entity_ref: decodeURIComponent(entityRef) })
      .andWhere('user_id', userId)
      .del();
  }

  async getMetadata(entityRef: string) {
    const coalesce = this.database.raw(
      'coalesce(count(members.entity_ref), 0) as members_count',
    );

    const columns = [
      'members.entity_ref',
      'metadata.entity_ref',
      'metadata.name',
      'metadata.announcement',
      'metadata.status',
      'metadata.updated_at',
      'metadata.community',
    ];

    return await this.database('metadata')
      .select([...columns, coalesce])
      .where({ 'metadata.entity_ref': entityRef })
      .groupBy(columns)
      .leftJoin('members', 'metadata.entity_ref', '=', 'members.entity_ref');
  }

  async insertMetadata(bazaarProject: any) {
    const { name, entityRef, community, announcement, status } = bazaarProject;

    await this.database
      .insert({
        name: name,
        entity_ref: entityRef,
        community: community,
        announcement: announcement,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .into('metadata');
  }

  async updateMetadata(bazaarProject: any) {
    const { entityRef, community, announcement, status } = bazaarProject;

    return await this.database('metadata')
      .where({ entity_ref: entityRef })
      .update({
        announcement: announcement,
        community: community,
        status: status,
        updated_at: new Date().toISOString(),
      });
  }

  async deleteMetadata(entityRef: string) {
    return await this.database('metadata')
      .where({ entity_ref: entityRef })
      .del();
  }

  async getEntities() {
    const coalesce = this.database.raw(
      'coalesce(count(members.entity_ref), 0) as members_count',
    );

    const columns = [
      'members.entity_ref',
      'metadata.entity_ref',
      'metadata.name',
      'metadata.announcement',
      'metadata.status',
      'metadata.updated_at',
      'metadata.community',
    ];
    return await this.database('metadata')
      .select([...columns, coalesce])
      .groupBy(columns)
      .leftJoin('members', 'metadata.entity_ref', '=', 'members.entity_ref');
  }
}
