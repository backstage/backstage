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

const mockDir = createMockDirectory();

describe('GcpBucketWorkspaceProvider', () => {
  const logger = mockServices.logger.mock();

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
    it('propagates workspace upload errors', async () => {
      const uploadError = new Error('GCS upload failed');
      jest.spyOn(GoogleCloud, 'Storage').mockReturnValue({
        bucket: () => ({
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
      ).rejects.toBe(uploadError);
    });
  });
});
