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

import {
  PermissionAction,
  PermissionAttributes,
  PermissionJSON,
} from './types/permission';

/**
 * A permission that can be checked through authorization.
 *
 * Permissions are the "what" part of authorization, the action to be performed. This may be reading
 * an entity from the catalog, executing a software template, or any other action a plugin author
 * may wish to protect.
 *
 * To evaluate authorization, a permission is paired with a Backstage identity (the "who") and
 * evaluated using an authorization policy.
 * @public
 */
export class Permission {
  constructor(
    readonly name: string,
    readonly attributes: PermissionAttributes,
    readonly resourceType?: string,
  ) {}

  is(permission: Permission) {
    return this.name === permission.name;
  }

  get isCreate() {
    return this.attributes.action === PermissionAction.Create;
  }

  get isRead() {
    return this.attributes.action === PermissionAction.Read;
  }

  get isUpdate() {
    return this.attributes.action === PermissionAction.Update;
  }

  get isDelete() {
    return this.attributes.action === PermissionAction.Delete;
  }

  toJSON(): PermissionJSON {
    return {
      name: this.name,
      attributes: this.attributes,
      resourceType: this.resourceType,
    };
  }

  static create({
    name,
    attributes,
    resourceType,
  }: PermissionJSON): Permission {
    return new Permission(name, attributes, resourceType);
  }
}
