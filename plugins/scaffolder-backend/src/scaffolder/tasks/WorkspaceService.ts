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

import { Config } from '@backstage/config';
import { CurrentClaimedTask } from './StorageTaskBroker';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';
import { DatabaseWorkspaceProvider } from './DatabaseWorkspaceProvider';
import { TaskStore } from './types';
import fs from 'fs-extra';

export interface WorkspaceService {
  serializeWorkspace(options: { path: string }): Promise<void>;

  cleanWorkspace(): Promise<void>;

  rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;
}

export class DefaultWorkspaceService implements WorkspaceService {
  static create(
    task: CurrentClaimedTask,
    storage: TaskStore,
    additionalWorkspaceProviders?: Record<string, WorkspaceProvider>,
    config?: Config,
  ) {
    const workspaceProviderName =
      config?.getOptionalString(
        'scaffolder.EXPERIMENTAL_workspaceSerializationProvider',
      ) ?? 'database';
    const workspaceProvider =
      additionalWorkspaceProviders?.[workspaceProviderName] ??
      DatabaseWorkspaceProvider.create(storage);
    return new DefaultWorkspaceService(task, workspaceProvider, config);
  }

  private constructor(
    private readonly task: CurrentClaimedTask,
    private readonly workspaceProvider: WorkspaceProvider,
    private readonly config?: Config,
  ) {}

  public async serializeWorkspace(options: { path: string }): Promise<void> {
    if (this.isWorkspaceSerializationEnabled()) {
      await this.workspaceProvider.serializeWorkspace({
        path: options.path,
        taskId: this.task.taskId,
      });
    }
  }

  public async cleanWorkspace(): Promise<void> {
    if (this.isWorkspaceSerializationEnabled()) {
      await this.workspaceProvider.cleanWorkspace({ taskId: this.task.taskId });
    }
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    if (this.isWorkspaceSerializationEnabled()) {
      await fs.mkdirp(options.targetPath);
      await this.workspaceProvider.rehydrateWorkspace(options);
    }
  }

  private isWorkspaceSerializationEnabled(): boolean {
    return (
      this.config?.getOptionalBoolean(
        'scaffolder.EXPERIMENTAL_workspaceSerialization',
      ) ?? false
    );
  }
}
