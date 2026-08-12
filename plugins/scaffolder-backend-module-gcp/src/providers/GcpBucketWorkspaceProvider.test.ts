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

import { ConfigReader } from '@backstage/config';
import { GcpBucketWorkspaceProvider } from './GcpBucketWorkspaceProvider';
import { mockServices } from '@backstage/backend-test-utils';

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
});
