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

import { Permission, PermissionAction } from '../types';

/**
 * Check if a given permission is related to a create action.
 * @public
 */
export function isCreatePermission(permission: Permission) {
  return permission.attributes.action === PermissionAction.Create;
}

/**
 * Check if a given permission is related to a read action.
 * @public
 */
export function isReadPermission(permission: Permission) {
  return permission.attributes.action === PermissionAction.Read;
}

/**
 * Check if a given permission is related to an update action.
 * @public
 */
export function isUpdatePermission(permission: Permission) {
  return permission.attributes.action === PermissionAction.Update;
}

/**
 * Check if a given permission is related to a delete action.
 * @public
 */
export function isDeletePermission(permission: Permission) {
  return permission.attributes.action === PermissionAction.Delete;
}
