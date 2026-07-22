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
import { createPermission } from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to a golden paths.
 *
 * @alpha
 */
export const RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH = 'goldenpaths-goldenpath';

/**
 * Permission resource type which corresponds to a golden paths tasks.
 *
 * @alpha
 */
export const RESOURCE_TYPE_GOLDEN_PATHS_TASK = 'goldenpaths-task';

/**
 * This permission is used to authorize actions that involve reading
 * one or more parameters from a golden path.
 *
 * If this permission is not authorized, it will appear that the
 * parameter does not exist in the golden path — both in the frontend
 * and in API responses.
 *
 * @alpha
 */
export const goldenPathParameterReadPermission = createPermission({
  name: 'goldenpaths.goldenpath.parameter.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
});

/**
 * This permission is used to authorize actions that involve reading
 * one or more steps from a golden path.
 *
 * If this permission is not authorized, it will appear that the
 * step does not exist in the golden path — both in the frontend
 * and in API responses. Steps will also not be executed.
 *
 * @alpha
 */
export const goldenPathStepReadPermission = createPermission({
  name: 'goldenpaths.goldenpath.step.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
});

/**
 * This permission is used to authorize actions that involve reading one or more tasks in the golden paths,
 * and reading logs of tasks
 *
 * @alpha
 */
export const taskReadPermission = createPermission({
  name: 'goldenpaths.task.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
});

/**
 * This permission is used to authorize actions that involve the creation of tasks in the golden paths.
 *
 * @alpha
 */
export const taskCreatePermission = createPermission({
  name: 'goldenpaths.task.create',
  attributes: {
    action: 'create',
  },
});

/**
 * This permission is used to authorize actions that involve the cancellation of tasks in the golden paths.
 *
 * @alpha
 */
export const taskCancelPermission = createPermission({
  name: 'goldenpaths.task.cancel',
  attributes: {},
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
});

/**
 * This permission is used to authorize actions that involve the completion of tasks in the golden paths.
 *
 * @alpha
 */
export const taskCompletePermission = createPermission({
  name: 'goldenpaths.task.complete',
  attributes: {},
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
});

/**
 * This permission is used to authorize actions that involve reading
 * a template from a golden path.
 *
 * @alpha
 */
export const templateReadPermission = createPermission({
  name: 'goldenpaths.template.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
});

/**
 * This permission is used to authorize actions that involve executing
 * a template from a golden path.
 *
 * @alpha
 */
export const templateExecutePermission = createPermission({
  name: 'goldenpaths.template.execute',
  attributes: {},
  resourceType: RESOURCE_TYPE_GOLDEN_PATHS_TASK,
});

/**
 * List of the golden paths permissions that are associated with golden path steps and parameters.
 * @alpha
 */
export const goldenPathsGoldenPathPermissions = [
  goldenPathParameterReadPermission,
  goldenPathStepReadPermission,
];

/**
 * List of the golden paths permissions that are associated with golden paths tasks.
 * @alpha
 */
export const goldenPathsTaskPermissions = [
  taskCancelPermission,
  taskCompletePermission,
  taskCreatePermission,
  taskReadPermission,
];

/**
 * List of the golden paths permissions that are associated with golden path templates.
 * @alpha
 */
export const goldenPathsTemplatePermissions = [
  templateReadPermission,
  templateExecutePermission,
];

/**
 * List of all the golden paths permissions
 * @alpha
 */
export const goldenPathsPermissions = [
  ...goldenPathsGoldenPathPermissions,
  ...goldenPathsTaskPermissions,
  ...goldenPathsTemplatePermissions,
];
