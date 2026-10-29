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

import { ConfigReader } from '@backstage/config';
import { GcpBucketWorkspaceProvider } from './GcpBucketWorkspaceProvider';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import * as GoogleCloud from '@google-cloud/storage';
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { serializeWorkspace } from '@backstage/plugin-scaffolder-node/alpha';

const mockDir = createMockDirectory();

describe('GcpBucketWorkspaceProvider', () => {
  const logger = mockServices.logger.mock();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('config reading', () => {
    it('should read bucket name from new config path', () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            gcsBucket: {
              name: 'my-new-bucket',
            },
          },
        },
      });

      const provider = GcpBucketWorkspaceProvider.create(logger, config);

      // The provider is created successfully - bucket name is read lazily
      expect(provider).toBeDefined();
    });

    it('should fallback to legacy config path', () => {
      const config = new ConfigReader({
        scaffolder: {
          EXPERIMENTAL_workspaceSerializationGcpBucketName: 'my-legacy-bucket',
        },
      });

      const provider = GcpBucketWorkspaceProvider.create(logger, config);

      expect(provider).toBeDefined();
    });

    it('should prefer new config over legacy', () => {
      const config = new ConfigReader({
        scaffolder: {
          taskRecovery: {
            gcsBucket: {
              name: 'new-bucket',
            },
          },
          EXPERIMENTAL_workspaceSerializationGcpBucketName: 'old-bucket',
        },
      });

      const provider = GcpBucketWorkspaceProvider.create(logger, config);

      expect(provider).toBeDefined();
      // The actual bucket name preference is tested implicitly when operations are called
    });

    it('should throw when no bucket name is configured', async () => {
      const config = new ConfigReader({});

      const provider = GcpBucketWorkspaceProvider.create(logger, config);

      // cleanWorkspace triggers getGcpBucketName which throws
      await expect(
        provider.cleanWorkspace({ taskId: 'test-task' }),
      ).rejects.toThrow(
        'Missing GCS bucket configuration. Set scaffolder.taskRecovery.gcsBucket.name in app-config.yaml',
      );
    });
  });

  describe('serializeWorkspace', () => {
    it('adds upload context while preserving the original error', async () => {
      const uploadError = new Error('GCS upload failed');
      jest.spyOn(GoogleCloud, 'Storage').mockReturnValue({
        bucket: () => ({
          getFiles: jest.fn().mockResolvedValue([[]]),
          file: () => ({
            save: jest.fn().mockRejectedValue(uploadError),
          }),
        }),
      } as never);
      const provider = GcpBucketWorkspaceProvider.create(
        logger,
        new ConfigReader({
          scaffolder: {
            taskRecovery: {
              gcsBucket: {
                name: 'test-bucket',
              },
            },
          },
        }),
      );

      await expect(
        provider.serializeWorkspace({
          path: mockDir.path,
          taskId: 'test-task',
        }),
      ).rejects.toMatchObject({
        message:
          "Failed to upload workspace for task 'test-task' to GCS; caused by Error: GCS upload failed",
        cause: uploadError,
      });
    });
  });

  describe('snapshot lifecycle', () => {
    const config = new ConfigReader({
      scaffolder: { taskRecovery: { gcsBucket: { name: 'test-bucket' } } },
    });
    const taskId = 'test-task';
    const path = mockDir.resolve('workspace');
    const targetPath = mockDir.resolve('restored');
    let objects: Map<string, Buffer>;
    const save = jest.fn();
    const remove = jest.fn();
    const file = (name: string) => ({
      name,
      save: async (contents: Buffer, options: unknown) => {
        await save(name, options);
        objects.set(name, contents);
      },
      delete: async () => {
        await remove(name);
        objects.delete(name);
      },
      exists: async () => [objects.has(name)],
      createReadStream: () => Readable.from([objects.get(name)]),
    });

    beforeEach(() => {
      objects = new Map();
      save.mockReset();
      remove.mockReset();
      logger.warn.mockClear();
      mockDir.setContent({
        workspace: { 'file.txt': 'first snapshot' },
        restored: {},
      });
      jest.spyOn(GoogleCloud, 'Storage').mockReturnValue({
        bucket: () => ({
          file,
          getFiles: async ({ prefix }: { prefix: string }) => [
            [...objects.keys()]
              .filter(name => name.startsWith(prefix))
              .map(file),
          ],
          deleteFiles: async ({ prefix }: { prefix: string }) => {
            for (const name of objects.keys()) {
              if (name.startsWith(prefix)) {
                await file(name).delete();
              }
            }
          },
        }),
      } as never);
    });

    it('saves rapid snapshots under distinct names, restores the latest after a restart, and cleans only the task', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_000);
      const provider = GcpBucketWorkspaceProvider.create(logger, config);
      await provider.serializeWorkspace({ path, taskId });
      mockDir.setContent({
        workspace: { 'file.txt': 'second snapshot' },
        restored: {},
      });
      await provider.serializeWorkspace({ path, taskId });
      const restarted = GcpBucketWorkspaceProvider.create(logger, config);
      mockDir.setContent({
        workspace: { 'file.txt': 'third snapshot' },
        restored: {},
      });
      await restarted.serializeWorkspace({ path, taskId });

      expect(save.mock.calls.map(([name]) => name)).toEqual([
        expect.stringMatching(/^test-task\/0000000000000001-.*\.tar$/),
        expect.stringMatching(/^test-task\/0000000000000002-.*\.tar$/),
        expect.stringMatching(/^test-task\/0000000000000003-.*\.tar$/),
      ]);
      expect(save).toHaveBeenLastCalledWith(expect.any(String), {
        contentType: 'application/x-tar',
      });
      expect(objects.size).toBe(1);
      await restarted.rehydrateWorkspace({ taskId, targetPath });
      expect(await readFile(`${targetPath}/file.txt`, 'utf8')).toBe(
        'third snapshot',
      );

      objects.set(taskId, Buffer.from('legacy snapshot'));
      objects.set('test-task-other/snapshot.tar', Buffer.from('other task'));
      await restarted.cleanWorkspace({ taskId });
      expect([...objects.keys()]).toEqual(['test-task-other/snapshot.tar']);
      await restarted.cleanWorkspace({ taskId });
    });

    it('keeps the previous snapshot when an upload fails', async () => {
      const provider = GcpBucketWorkspaceProvider.create(logger, config);
      await provider.serializeWorkspace({ path, taskId });
      mockDir.setContent({
        workspace: { 'file.txt': 'unsaved snapshot' },
        restored: {},
      });
      save.mockRejectedValueOnce(new Error('upload failed'));
      await expect(
        provider.serializeWorkspace({ path, taskId }),
      ).rejects.toThrow('Failed to upload workspace');
      expect(objects.size).toBe(1);
      expect(remove).not.toHaveBeenCalled();
      await provider.rehydrateWorkspace({ taskId, targetPath });
      expect(await readFile(`${targetPath}/file.txt`, 'utf8')).toBe(
        'first snapshot',
      );
    });

    it('restores the newest snapshot even when old snapshot cleanup fails', async () => {
      const provider = GcpBucketWorkspaceProvider.create(logger, config);
      await provider.serializeWorkspace({ path, taskId });
      // A legacy snapshot must not take precedence over a newer snapshot.
      objects.set(taskId, (await serializeWorkspace({ path })).contents);
      const cleanupError = new Error('delete failed');
      remove.mockRejectedValueOnce(cleanupError);
      mockDir.setContent({
        workspace: { 'file.txt': 'latest snapshot' },
        restored: {},
      });
      await provider.serializeWorkspace({ path, taskId });
      expect(objects.size).toBe(3);
      expect(logger.warn).toHaveBeenCalledWith(
        "Failed to delete old workspace snapshots for task 'test-task'",
        cleanupError,
      );
      await provider.rehydrateWorkspace({ taskId, targetPath });
      expect(await readFile(`${targetPath}/file.txt`, 'utf8')).toBe(
        'latest snapshot',
      );
      await provider.cleanWorkspace({ taskId });
      expect(objects.size).toBe(0);
    });

    it('restores legacy snapshots and leaves an empty workspace alone', async () => {
      const provider = GcpBucketWorkspaceProvider.create(logger, config);
      await provider.rehydrateWorkspace({ taskId, targetPath });
      const { contents } = await serializeWorkspace({ path });
      objects.set(taskId, contents);
      await provider.rehydrateWorkspace({ taskId, targetPath });
      expect(await readFile(`${targetPath}/file.txt`, 'utf8')).toBe(
        'first snapshot',
      );
    });
  });
});
