/*
 * Copyright 2026 The Backstage Authors
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
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import {
  SkillFileRow,
  SkillRow,
  SkillsListOptions,
  SkillsStore,
} from './SkillsStore';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-skills-backend',
  'migrations',
);

/** @internal */
export class DatabaseSkillsStore implements SkillsStore {
  private readonly db: Knex;

  private constructor(db: Knex) {
    this.db = db;
  }

  static async create({
    database,
    skipMigrations,
  }: {
    database: DatabaseService;
    skipMigrations?: boolean;
  }): Promise<DatabaseSkillsStore> {
    const client = await database.getClient();

    if (!database.migrations?.skip && !skipMigrations) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseSkillsStore(client);
  }

  async getSkill(name: string): Promise<SkillRow | undefined> {
    return this.db<SkillRow>('skills').where({ name }).first();
  }

  async getSkillFiles(name: string): Promise<SkillFileRow[]> {
    return this.db<SkillFileRow>('skill_files').where({ skill_name: name });
  }

  async getSkillFile(
    name: string,
    path: string,
  ): Promise<SkillFileRow | undefined> {
    return this.db<SkillFileRow>('skill_files')
      .where({ skill_name: name, path })
      .first();
  }

  async listSkills(
    options: SkillsListOptions,
  ): Promise<{ skills: SkillRow[]; totalCount: number }> {
    const {
      search,
      source,
      offset = 0,
      limit = 20,
      orderBy = 'name',
      order = 'asc',
    } = options;

    let query = this.db<SkillRow>('skills');
    let countQuery = this.db<SkillRow>('skills');

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(function searchQuery() {
        this.where('name', 'like', searchTerm).orWhere(
          'description',
          'like',
          searchTerm,
        );
      });
      countQuery = countQuery.where(function countSearchQuery() {
        this.where('name', 'like', searchTerm).orWhere(
          'description',
          'like',
          searchTerm,
        );
      });
    }

    if (source) {
      query = query.where({ source });
      countQuery = countQuery.where({ source });
    }

    const [countResult] = await countQuery.count({ count: '*' });
    const totalCount =
      typeof countResult.count === 'string'
        ? Number.parseInt(countResult.count, 10)
        : (countResult.count as number);

    const skills = await query
      .orderBy(orderBy, order)
      .offset(offset)
      .limit(limit);

    return { skills, totalCount };
  }

  async replaceSkillsForSource(
    source: string,
    skills: Array<{
      skill: Omit<SkillRow, 'created_at' | 'updated_at'>;
      files: SkillFileRow[];
    }>,
  ): Promise<SkillRow[]> {
    return this.db.transaction(async trx => {
      // Get all existing skill names for this source
      const existingSkills = await trx<SkillRow>('skills')
        .where({ source })
        .select('name');
      const existingNames = existingSkills.map(s => s.name);

      // Delete all existing files and skills for this source
      if (existingNames.length > 0) {
        await trx('skill_files').whereIn('skill_name', existingNames).delete();
        await trx('skills').where({ source }).delete();
      }

      // Insert new skills and files
      const now = new Date();
      for (const { skill, files } of skills) {
        await trx('skills').insert({
          ...skill,
          source,
          created_at: now,
          updated_at: now,
        });

        if (files.length > 0) {
          await trx('skill_files').insert(files);
        }
      }

      return trx<SkillRow>('skills').where({ source });
    });
  }

  async getAllSkillsForIndex(): Promise<
    Array<{ name: string; description: string; files: string[] }>
  > {
    const skills = await this.db<SkillRow>('skills')
      .select('name', 'description')
      .orderBy('name', 'asc');

    const fileRows = await this.db<SkillFileRow>('skill_files').select(
      'skill_name',
      'path',
    );

    const filesBySkill = new Map<string, string[]>();
    for (const row of fileRows) {
      const existing = filesBySkill.get(row.skill_name) || [];
      existing.push(row.path);
      filesBySkill.set(row.skill_name, existing);
    }

    return skills.map(s => ({
      name: s.name,
      description: s.description,
      files: filesBySkill.get(s.name) || ['SKILL.md'],
    }));
  }
}
