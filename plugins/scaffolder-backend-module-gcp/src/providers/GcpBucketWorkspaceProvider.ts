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
import { ForwardedError } from '@backstage/errors';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';

import getRawBody from 'raw-body';
import { Storage } from '@google-cloud/storage';
import { LoggerService } from '@backstage/backend-plugin-api';
import { randomUUID } from 'node:crypto';

import {
  serializeWorkspace,
  restoreWorkspace,
} from '@backstage/plugin-scaffolder-node/alpha';

export class GcpBucketWorkspaceProvider implements WorkspaceProvider {
  private readonly storage: Storage;
  private readonly logger: LoggerService;
  private readonly config?: Config;

  static create(logger: LoggerService, config?: Config) {
    return new GcpBucketWorkspaceProvider(new Storage(), logger, config);
  }

  private constructor(
    storage: Storage,
    logger: LoggerService,
    config?: Config,
  ) {
    this.storage = storage;
    this.logger = logger;
    this.config = config;
  }

  public async cleanWorkspace(options: { taskId: string }): Promise<void> {
    await this.storage.bucket(this.getGcpBucketName()).deleteFiles({
      prefix: `${options.taskId}/`,
    });

    // Also remove snapshots written by older versions of the provider.
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
    const { contents: workspace } = await serializeWorkspace(options);
    const bucket = this.storage.bucket(this.getGcpBucketName());
    const prefix = `${options.taskId}/`;
    const [files] = await bucket.getFiles({ prefix });
    // Derive the sequence from stored snapshots so ordering survives restarts
    // and does not depend on clock resolution or clock skew between workers.
    const sequence =
      files.reduce(
        (latest, file) =>
          Math.max(
            latest,
            Number(file.name.slice(prefix.length).split('-')[0]) || 0,
          ),
        0,
      ) + 1;
    const fileCloud = bucket.file(
      `${prefix}${String(sequence).padStart(16, '0')}-${randomUUID()}.tar`,
    );
    try {
      await fileCloud.save(workspace, {
        contentType: 'application/x-tar',
      });
    } catch (error) {
      throw new ForwardedError(
        `Failed to upload workspace for task '${options.taskId}' to GCS`,
        error,
      );
    }
    this.logger.info(
      `Workspace for task ${options.taskId} has been serialized.`,
    );

    // Only remove snapshots that existed before this upload. Cleanup failure
    // must not invalidate a successfully saved workspace.
    try {
      await Promise.all(
        files.map(file => file.delete({ ignoreNotFound: true })),
      );
    } catch (error) {
      this.logger.warn(
        `Failed to delete old workspace snapshots for task '${options.taskId}'`,
        error,
      );
    }
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    const bucket = this.storage.bucket(this.getGcpBucketName());
    const [files] = await bucket.getFiles({ prefix: `${options.taskId}/` });
    const latest = files.sort((a, b) => b.name.localeCompare(a.name))[0];
    if (latest) {
      const workspace = await getRawBody(latest.createReadStream());
      await restoreWorkspace({ path: options.targetPath, buffer: workspace });
      return;
    }

    // Tasks started before upgrading may still have a single legacy snapshot.
    const file = bucket.file(options.taskId);
    const result = await file.exists();
    if (result[0]) {
      const workspace = await getRawBody(file.createReadStream());
      await restoreWorkspace({ path: options.targetPath, buffer: workspace });
    }
  }

  private getGcpBucketName(): string {
    // New config path with fallback to old experimental flag
    const bucketName =
      this.config?.getOptionalString(
        'scaffolder.taskRecovery.gcsBucket.name',
      ) ??
      this.config?.getOptionalString(
        'scaffolder.EXPERIMENTAL_workspaceSerializationGcpBucketName',
      );
    if (!bucketName) {
      throw new Error(
        `Missing GCS bucket configuration. Set scaffolder.taskRecovery.gcsBucket.name in app-config.yaml`,
      );
    }
    return bucketName;
  }
}
