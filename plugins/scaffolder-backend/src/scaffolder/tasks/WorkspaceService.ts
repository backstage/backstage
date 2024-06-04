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

import { TaskStore } from './types';

import { CurrentClaimedTask } from './StorageTaskBroker';
import { Config } from '@backstage/config';

type WorkspaceSerializationProvider = 'database' | 'googleCloudBucket';

export interface WorkspaceService {
  serializeWorkspace(options: { path: string }): Promise<void>;

  cleanWorkspace(): Promise<void>;

  rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;
}

export class DefaultWorkspaceService implements WorkspaceService {
  static create(task: CurrentClaimedTask, storage: TaskStore, config?: Config) {
    return new DefaultWorkspaceService(task, storage, config);
  }

  private constructor(
    private readonly task: CurrentClaimedTask,
    private readonly storage: TaskStore,
    private readonly config?: Config,
  ) {}

  public async serializeWorkspace(options: { path: string }): Promise<void> {
    if (this.isWorkspaceSerializationEnabled()) {
      const provider = this.getWorkspaceSerializationProvider();
      switch (provider) {
        case 'database':
          this.storage.serializeWorkspace?.({
            path: options.path,
            taskId: this.task.taskId,
          });
          return;
        case 'googleCloudBucket':
          return;
        default:
          throw new Error(
            `Workspace serialization provider ${provider} is not supported`,
          );
      }
    }
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    if (this.isWorkspaceSerializationEnabled()) {
      this.storage.rehydrateWorkspace?.(options);
    }
  }

  public async cleanWorkspace(): Promise<void> {}

  private isWorkspaceSerializationEnabled(): boolean {
    return (
      this.config?.getOptionalBoolean(
        'scaffolder.EXPERIMENTAL_workspaceSerialization',
      ) ?? false
    );
  }

  private getWorkspaceSerializationProvider(): WorkspaceSerializationProvider {
    return (this.config?.getOptionalString(
      'scaffolder.EXPERIMENTAL_workspaceSerializationProvider',
    ) ?? 'database') as WorkspaceSerializationProvider;
  }
}
