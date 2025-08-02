/*
 * Copyright 2025 The Backstage Authors
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
import { createApiRef } from '@backstage/core-plugin-api';
import { type Task } from '@backstage/plugin-tasks-common';

/**
 * This API is used by various frontend utilities that allow developers to read or trigger tasks within their frontend
 * plugins. A plugin developer will likely not have to interact with this API or its implementations directly, but
 * rather with the aforementioned utility components/hooks.
 *
 * @public
 */
export interface TasksApi {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  triggerTask(id: string): Promise<void>;
}

/**
 * A Backstage ApiRef for the Permission API. See https://backstage.io/docs/api/utility-apis for more information on
 * Backstage ApiRefs.
 *
 * @public
 */
export const tasksApiRef = createApiRef<TasksApi>({
  id: 'plugin.tasks.service',
});
