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

import { Config } from '@backstage/config';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';

import getRawBody from 'raw-body';
import { Storage } from '@google-cloud/storage';
import { LoggerService } from '@backstage/backend-plugin-api';

import {
  serializeWorkspace,
  restoreWorkspace,
} from '@backstage/plugin-scaffolder-node/alpha';

export class GcpBucketWorkspaceProvider implements WorkspaceProvider {
  static create(logger: LoggerService, config?: Config) {
    return new GcpBucketWorkspaceProvider(new Storage(), logger, config);
  }

  private constructor(
    private readonly storage: Storage,
    private readonly logger: LoggerService,
    private readonly config?: Config,
  ) {}

  public async cleanWorkspace(options: { taskId: string }): Promise<void> {
    const file = this.storage
      .bucket(this.getGcpBucketName())
      .file(options.taskId);

    const result = await file.exists();
    if (result[0]) {
      await file.delete();
    }
  }

  public async serializeWorkspace(options: {
    path: string;
    taskId: string;
  }): Promise<void> {
    const fileCloud = this.storage
      .bucket(this.getGcpBucketName())
      .file(options.taskId);
    const { contents: workspace } = await serializeWorkspace(options);
    try {
      await fileCloud.save(workspace, {
        contentType: 'application/x-tar',
      });
    } catch (err) {
      this.logger.error(
        `An error occurred during uploading the workspace of task ${
          options.taskId
        } into GCP bucket ${this.getGcpBucketName()}`,
      );
    }
    this.logger.info(
      `Workspace for task ${options.taskId} has been serialized.`,
    );
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    const bucket = this.storage.bucket(this.getGcpBucketName());
    const file = bucket.file(options.taskId);
    const result = await file.exists();
    if (result[0]) {
      const workspace = await getRawBody(file.createReadStream());
      await restoreWorkspace({ path: options.targetPath, buffer: workspace });
    }
  }

  private getGcpBucketName(): string {
    const bucketName = this.config?.getOptionalString(
      'scaffolder.EXPERIMENTAL_workspaceSerializationGcpBucketName',
    );
    if (!bucketName) {
      throw new Error(
        `You've missed to configure scaffolder.EXPERIMENTAL_workspaceSerializationGcpBucketName in app-config.yaml file`,
      );
    }
    return bucketName;
  }
}
