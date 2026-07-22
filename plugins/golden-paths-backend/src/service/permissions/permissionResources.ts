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
import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import { SerializedTask } from '../../golden-paths';
import {
  GoldenPathEntityStepV1beta1,
  GoldenPathParametersV1beta1,
  RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
  RESOURCE_TYPE_GOLDEN_PATHS_TASK,
} from '@backstage/plugin-golden-paths-common';

export type TaskFilter = {
  key: string;
  values?: string[];
};

export const goldenPathPermissionResourceRef = createPermissionResourceRef<
  GoldenPathEntityStepV1beta1 | GoldenPathParametersV1beta1,
  {}
>().with({
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
  pluginId: 'golden-paths',
});

export const taskPermissionResourceRef = createPermissionResourceRef<
  SerializedTask,
  TaskFilter
>().with({
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
  pluginId: 'golden-paths',
});
