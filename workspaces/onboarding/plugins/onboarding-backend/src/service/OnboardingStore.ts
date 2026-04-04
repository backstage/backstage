/*
 * Copyright 2026 Estehsan Tariq
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

import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { OnboardingProgress, OnboardingProgressRow } from '../types';

const migrationsDir = resolvePackagePath(
  '@estehsaan/backstage-plugin-onboarding-backend',
  'migrations',
);

/** @public */
export class DatabaseOnboardingStore {
  private constructor(private readonly db: Knex) {}

  static async create(options: {
    database: DatabaseService;
    skipMigrations?: boolean;
  }): Promise<DatabaseOnboardingStore> {
    const { database, skipMigrations } = options;
    const client = await database.getClient();

    if (!database.migrations?.skip && !skipMigrations) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseOnboardingStore(client);
  }

  async getProgress(userId: string): Promise<OnboardingProgress | undefined> {
    const row = await this.db<OnboardingProgressRow>('onboarding_progress')
      .where('user_id', userId)
      .first();

    if (!row) {
      return undefined;
    }

    return this.rowToProgress(row);
  }

  async upsertProgress(progress: OnboardingProgress): Promise<void> {
    const tasksJson = JSON.stringify(progress.tasks);
    const now = this.db.fn.now() as unknown as string;

    // Use INSERT … ON CONFLICT DO UPDATE to avoid a TOCTOU race where two
    // concurrent requests both see no row and both try to INSERT.
    await this.db<OnboardingProgressRow>('onboarding_progress')
      .insert({
        id: uuid(),
        user_id: progress.userId,
        template_name: progress.templateName,
        start_date: progress.startDate,
        tasks: tasksJson,
        updated_at: now,
      })
      .onConflict('user_id')
      .merge({
        template_name: progress.templateName,
        tasks: tasksJson,
        updated_at: now,
      });
  }

  async getTeamProgress(userIds: string[]): Promise<OnboardingProgress[]> {
    if (userIds.length === 0) {
      return [];
    }

    const rows = await this.db<OnboardingProgressRow>('onboarding_progress')
      .whereIn('user_id', userIds)
      .select();

    return rows.map(row => this.rowToProgress(row));
  }

  private rowToProgress(row: OnboardingProgressRow): OnboardingProgress {
    let tasks: OnboardingProgress['tasks'];
    try {
      const parsed = JSON.parse(row.tasks);
      tasks = Array.isArray(parsed) ? parsed : [];
    } catch {
      tasks = [];
    }
    return {
      userId: row.user_id,
      templateName: row.template_name,
      startDate: row.start_date,
      tasks,
    };
  }
}
