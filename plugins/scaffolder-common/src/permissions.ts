/*
 * Copyright 2022 The Backstage Authors
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
 * Permission resource type which corresponds to a scaffolder templates.
 *
 * @public
 */
export const RESOURCE_TYPE_SCAFFOLDER_TEMPLATE = 'scaffolder-template';

/**
 * Permission resource type which corresponds to a scaffolder action.
 *
 * @public
 */
export const RESOURCE_TYPE_SCAFFOLDER_ACTION = 'scaffolder-action';

/**
 * This permission is used to authorize actions that involve executing
 * an action from a template.
 *
 * @public
 */
export const actionExecutePermission = createPermission({
  name: 'scaffolder.action.execute',
  attributes: {},
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
});

/**
 * This permission is used to authorize actions that involve reading
 * one or more parameters from a template.
 *
 * If this permission is not authorized, it will appear that the
 * parameter does not exist in the template — both in the frontend
 * and in API responses.
 *
 * @public
 */
export const templateParameterReadPermission = createPermission({
  name: 'scaffolder.template.parameter.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
});

/**
 * This permission is used to authorize actions that involve reading
 * one or more steps from a template.
 *
 * If this permission is not authorized, it will appear that the
 * step does not exist in the template — both in the frontend
 * and in API responses. Steps will also not be executed.
 *
 * @public
 */
export const templateStepReadPermission = createPermission({
  name: 'scaffolder.template.step.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
});

/**
 * This permission is used to authorize actions that involve reading one or more tasks in the scaffolder,
 * and reading logs of tasks
 *
 * @public
 */
export const taskReadPermission = createPermission({
  name: 'scaffolder.task.read',
  attributes: {
    action: 'read',
  },
});

/**
 * This permission is used to authorize actions that involve the creation of tasks in the scaffolder.
 *
 * @public
 */
export const taskCreatePermission = createPermission({
  name: 'scaffolder.task.create',
  attributes: {
    action: 'create',
  },
});

/**
 * This permission is used to authorize actions that involve the cancellation of tasks in the scaffolder.
 *
 * @public
 */
export const taskCancelPermission = createPermission({
  name: 'scaffolder.task.cancel',
  attributes: {},
});

/**
 * This permission is used to authorize template management features.
 *
 * @public
 */
export const templateManagementPermission = createPermission({
  name: 'scaffolder.template.management',
  attributes: {},
});

/**
 * List of the scaffolder permissions that are associated with template steps and parameters.
 * @public
 */
export const scaffolderTemplatePermissions = [
  templateParameterReadPermission,
  templateStepReadPermission,
];

/**
 * List of the scaffolder permissions that are associated with scaffolder actions.
 * @public
 */
export const scaffolderActionPermissions = [actionExecutePermission];

/**
 * List of the scaffolder permissions that are associated with scaffolder tasks.
 * @public
 */
export const scaffolderTaskPermissions = [
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
];

/**
 * List of all the scaffolder permissions
 * @public
 */
export const scaffolderPermissions = [
  ...scaffolderTemplatePermissions,
  ...scaffolderActionPermissions,
  ...scaffolderTaskPermissions,
  templateManagementPermission,
];
