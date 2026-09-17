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

import { Knex } from 'knex';
import {
  WorkspaceProvider,
  serializeWorkspace,
  restoreWorkspace,
} from '@backstage/plugin-scaffolder-node/alpha';

const MAX_WORKSPACE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

type RawDbTaskWorkspaceRow = {
  task_id: string;
  workspace: Buffer;
  created_at: Date;
};

/**
 * A workspace provider that stores serialized workspaces in the database.
 *
 * @remarks
 * This provider is intended for development use only. It has a 50MB size limit
 * and is disabled in production unless explicitly enabled via config.
 *
 * For production use, consider using an external storage provider like GCS.
 */
export class DatabaseWorkspaceProvider implements WorkspaceProvider {
  private readonly db: Knex;
  private legacyWorkspaceColumn?: Promise<boolean>;

  static create(options: { db: Knex }) {
    return new DatabaseWorkspaceProvider(options.db);
  }

  private constructor(db: Knex) {
    this.db = db;
  }

  private hasLegacyWorkspaceColumn(): Promise<boolean> {
    this.legacyWorkspaceColumn ??= this.db.schema.hasColumn(
      'tasks',
      'workspace',
    );
    return this.legacyWorkspaceColumn;
  }

  public async serializeWorkspace(options: {
    path: string;
    taskId: string;
  }): Promise<void> {
    const { contents: workspace } = await serializeWorkspace({
      path: options.path,
    });

    if (workspace.length > MAX_WORKSPACE_SIZE_BYTES) {
      throw new Error(
        `Workspace size (${Math.round(
          workspace.length / 1024 / 1024,
        )}MB) exceeds ` +
          `maximum allowed size of 50MB for database storage. ` +
          `Consider using an external storage provider like GCS.`,
      );
    }

    const hasLegacyWorkspaceColumn = await this.hasLegacyWorkspaceColumn();
    await this.db.transaction(async tx => {
      await tx<RawDbTaskWorkspaceRow>('scaffolder_task_workspaces')
        .insert({
          task_id: options.taskId,
          workspace,
        })
        .onConflict('task_id')
        .merge(['workspace']);

      if (hasLegacyWorkspaceColumn) {
        await tx('tasks')
          .where({ id: options.taskId })
          .whereNotNull('workspace')
          .update({ workspace });
      }
    });
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    let workspace: Buffer | undefined;
    if (await this.hasLegacyWorkspaceColumn()) {
      const legacyRow = await this.db('tasks')
        .where({ id: options.taskId })
        .select('workspace')
        .first();
      workspace = legacyRow?.workspace ?? undefined;
    }

    if (workspace) {
      await this.db<RawDbTaskWorkspaceRow>('scaffolder_task_workspaces')
        .insert({ task_id: options.taskId, workspace })
        .onConflict('task_id')
        .merge(['workspace']);
    } else {
      const row = await this.db<RawDbTaskWorkspaceRow>(
        'scaffolder_task_workspaces',
      )
        .where({ task_id: options.taskId })
        .first();
      workspace = row?.workspace;
    }

    if (workspace) {
      await restoreWorkspace({
        path: options.targetPath,
        buffer: workspace,
      });
    }
  }

  public async cleanWorkspace(options: { taskId: string }): Promise<void> {
    const hasLegacyWorkspaceColumn = await this.hasLegacyWorkspaceColumn();
    await this.db.transaction(async tx => {
      await tx<RawDbTaskWorkspaceRow>('scaffolder_task_workspaces')
        .where({ task_id: options.taskId })
        .delete();
      if (hasLegacyWorkspaceColumn) {
        await tx('tasks')
          .where({ id: options.taskId })
          .update({ workspace: null });
      }
    });
  }
}
