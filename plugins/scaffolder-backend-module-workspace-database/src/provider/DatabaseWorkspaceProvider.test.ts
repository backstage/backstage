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

import { DatabaseManager } from '@backstage/backend-defaults/database';
import { ConfigReader } from '@backstage/config';
import {
  mockServices,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import { DatabaseWorkspaceProvider } from './DatabaseWorkspaceProvider';
import {
  restoreWorkspace,
  serializeWorkspace,
} from '@backstage/plugin-scaffolder-node/alpha';
import { Knex } from 'knex';
import fs from 'fs-extra';
import path from 'node:path';

const migrationsDir = path.resolve(__dirname, '../../migrations');

describe('DatabaseWorkspaceProvider', () => {
  let db: Knex;
  let provider: DatabaseWorkspaceProvider;

  const workspaceDir = createMockDirectory({
    content: {
      'app-config.yaml': `
app:
  title: Example App
`,
      'src/index.ts': 'console.log("hello");',
    },
  });

  beforeAll(async () => {
    const manager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'better-sqlite3',
            connection: ':memory:',
          },
        },
      }),
    );
    db = await manager
      .forPlugin('scaffolder', {
        logger: mockServices.logger.mock(),
        lifecycle: mockServices.lifecycle.mock(),
      })
      .getClient();
    await db.schema.createTable('tasks', table => {
      table.string('id').primary();
      table.binary('workspace').nullable();
    });
    await db.migrate.latest({
      directory: migrationsDir,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    provider = DatabaseWorkspaceProvider.create({ db });
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('serializeWorkspace', () => {
    it('should serialize and store workspace in database', async () => {
      const taskId = 'test-task-1';

      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      const row = await db('scaffolder_task_workspaces')
        .where({ task_id: taskId })
        .first();

      expect(row).toBeDefined();
      expect(row.workspace).toBeDefined();
      expect(row.workspace.length).toBeGreaterThan(0);
    });

    it('should update existing workspace on second call', async () => {
      const taskId = 'test-task-2';

      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      // Call again - should upsert
      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      const rows = await db('scaffolder_task_workspaces').where({
        task_id: taskId,
      });

      expect(rows).toHaveLength(1);
    });

    it('keeps legacy tasks readable by an application rollback', async () => {
      const taskId = 'test-task-rollback';
      await db('tasks').insert({
        id: taskId,
        workspace: Buffer.from('legacy placeholder'),
      });

      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      const legacy = await db('tasks').where({ id: taskId }).first();
      const rollbackDir = createMockDirectory();
      await restoreWorkspace({
        path: rollbackDir.path,
        buffer: legacy.workspace,
      });
      expect(
        fs.existsSync(path.join(rollbackDir.path, 'app-config.yaml')),
      ).toBe(true);
    });

    it('should serialize a workspace below 50MB', async () => {
      const taskId = 'test-task-below-limit';
      const largeDir = createMockDirectory();

      fs.writeFileSync(
        path.join(largeDir.path, 'large-file.txt'),
        Buffer.alloc(6 * 1024 * 1024, 'x'),
      );

      await expect(
        provider.serializeWorkspace({
          path: largeDir.path,
          taskId,
        }),
      ).resolves.toBeUndefined();
    });

    it('should throw if workspace exceeds 50MB', async () => {
      const taskId = 'test-task-large';
      const largeDir = createMockDirectory();

      fs.writeFileSync(
        path.join(largeDir.path, 'large-file.txt'),
        Buffer.alloc(51 * 1024 * 1024, 'x'),
      );

      await expect(
        provider.serializeWorkspace({
          path: largeDir.path,
          taskId,
        }),
      ).rejects.toThrow(/exceeds maximum allowed size of 50MB/);
    });
  });

  describe('rehydrateWorkspace', () => {
    it('should restore workspace from database', async () => {
      const taskId = 'test-task-3';
      const targetDir = createMockDirectory();

      // First serialize
      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      // Then rehydrate to a new location
      await provider.rehydrateWorkspace({
        taskId,
        targetPath: targetDir.path,
      });

      expect(
        fs.existsSync(path.join(targetDir.path, 'app-config.yaml')),
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(targetDir.path, 'src/index.ts')),
      ).toBeTruthy();
    });

    it('should do nothing if no workspace exists', async () => {
      const taskId = 'nonexistent-task';
      const targetDir = createMockDirectory();

      // Should not throw
      await provider.rehydrateWorkspace({
        taskId,
        targetPath: targetDir.path,
      });

      // Directory should still be empty (or just have what was there)
      const files = fs.readdirSync(targetDir.path);
      expect(files).toHaveLength(0);
    });

    it('prefers a legacy workspace written during a rolling upgrade', async () => {
      const taskId = 'test-task-rolling-upgrade';
      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      const legacyDir = createMockDirectory({
        content: { 'written-by-old-worker.txt': 'latest workspace' },
      });
      const { contents: legacyWorkspace } = await serializeWorkspace({
        path: legacyDir.path,
      });
      await db('tasks').insert({
        id: taskId,
        workspace: legacyWorkspace,
      });

      const targetDir = createMockDirectory();
      await provider.rehydrateWorkspace({
        taskId,
        targetPath: targetDir.path,
      });

      expect(
        fs.readFileSync(
          path.join(targetDir.path, 'written-by-old-worker.txt'),
          'utf8',
        ),
      ).toBe('latest workspace');
    });
  });

  describe('cleanWorkspace', () => {
    it('should delete workspace from database', async () => {
      const taskId = 'test-task-4';

      await db('tasks').insert({
        id: taskId,
        workspace: Buffer.from('legacy workspace'),
      });

      await provider.serializeWorkspace({
        path: workspaceDir.path,
        taskId,
      });

      // Verify it exists
      let row = await db('scaffolder_task_workspaces')
        .where({ task_id: taskId })
        .first();
      expect(row).toBeDefined();

      // Clean it
      await provider.cleanWorkspace({ taskId });

      // Verify it's gone
      row = await db('scaffolder_task_workspaces')
        .where({ task_id: taskId })
        .first();
      expect(row).toBeUndefined();
      const legacy = await db('tasks').where({ id: taskId }).first();
      expect(legacy.workspace).toBeNull();
    });

    it('should not throw if workspace does not exist', async () => {
      const taskId = 'nonexistent-task';

      await expect(
        provider.cleanWorkspace({ taskId }),
      ).resolves.toBeUndefined();
    });
  });
});
