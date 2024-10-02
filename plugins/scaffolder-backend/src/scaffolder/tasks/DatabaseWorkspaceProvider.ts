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

import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';

export class DatabaseWorkspaceProvider implements WorkspaceProvider {
  static create(storage: TaskStore) {
    return new DatabaseWorkspaceProvider(storage);
  }

  private constructor(private readonly storage: TaskStore) {}

  public async serializeWorkspace(options: {
    path: string;
    taskId: string;
  }): Promise<void> {
    await this.storage.serializeWorkspace?.(options);
  }

  public async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    return this.storage.rehydrateWorkspace?.(options);
  }

  public async cleanWorkspace(options: { taskId: string }): Promise<void> {
    return this.storage.cleanWorkspace?.(options);
  }
}
