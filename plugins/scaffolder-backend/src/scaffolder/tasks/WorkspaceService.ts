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

import type { Config } from '@backstage/config';
import type { CurrentClaimedTask } from './StorageTaskBroker';
import type { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';
import fs from 'fs-extra';

export interface WorkspaceService {
  serializeWorkspace(options: { path: string }): Promise<void>;

  cleanWorkspace(): Promise<void>;

  rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;
}

export function resolveWorkspaceProvider(
  workspaceProviders?: Record<string, WorkspaceProvider>,
  config?: Config,
): WorkspaceProvider | undefined {
  const legacySerializationEnabled =
    config?.getOptionalBoolean(
      'scaffolder.EXPERIMENTAL_workspaceSerialization',
    ) ?? false;
  const providerName =
    config?.getOptionalString('scaffolder.taskRecovery.workspaceProvider') ??
    (legacySerializationEnabled
      ? config?.getOptionalString(
          'scaffolder.EXPERIMENTAL_workspaceSerializationProvider',
        ) ?? 'database'
      : undefined);

  if (!providerName) {
    return undefined;
  }

  const workspaceProvider =
    workspaceProviders &&
    Object.prototype.hasOwnProperty.call(workspaceProviders, providerName)
      ? workspaceProviders[providerName]
      : undefined;

  if (!workspaceProvider) {
    throw new Error(
      `Workspace provider '${providerName}' is configured but not available. ` +
        `Make sure to install and register the corresponding module. ` +
        `For database storage, add '@backstage/plugin-scaffolder-backend-module-workspace-database'.`,
    );
  }

  return workspaceProvider;
}

export class DefaultWorkspaceService implements WorkspaceService {
  static create(
    task: CurrentClaimedTask,
    workspaceProvider?: WorkspaceProvider,
  ) {
    return new DefaultWorkspaceService(task, workspaceProvider);
  }

  private readonly task: CurrentClaimedTask;
  private readonly workspaceProvider?: WorkspaceProvider;

  private constructor(
    task: CurrentClaimedTask,
    workspaceProvider: WorkspaceProvider | undefined,
  ) {
    this.task = task;
    this.workspaceProvider = workspaceProvider;
  }

  public async serializeWorkspace(options: { path: string }): Promise<void> {
    if (this.workspaceProvider) {
      await this.workspaceProvider.serializeWorkspace({
        path: options.path,
        taskId: this.task.taskId,
      });
    }
  }

  public async cleanWorkspace(): Promise<void> {
    if (this.workspaceProvider) {
      await this.workspaceProvider.cleanWorkspace({ taskId: this.task.taskId });
    }
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    if (this.workspaceProvider) {
      await fs.mkdirp(options.targetPath);
      await this.workspaceProvider.rehydrateWorkspace(options);
    }
  }
}
