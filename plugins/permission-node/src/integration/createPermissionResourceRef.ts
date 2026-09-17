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

/**
 * @public
 */
export type PermissionResourceRef<
  TResource = unknown,
  TQuery = unknown,
  TResourceType extends string = string,
  TPluginId extends string = string,
> = {
  readonly $$type: '@backstage/PermissionResourceRef';
  readonly pluginId: TPluginId;
  readonly resourceType: TResourceType;
  readonly TQuery: TQuery;
  readonly TResource: TResource;
};

/**
 * @public
 */
export function createPermissionResourceRef<TResource, TQuery>(): {
  with<TPluginId extends string, TResourceType extends string>(options: {
    pluginId: TPluginId;
    resourceType: TResourceType;
  }): PermissionResourceRef<TResource, TQuery, TResourceType, TPluginId>;
} {
  return {
    with<TPluginId extends string, TResourceType extends string>(options: {
      pluginId: TPluginId;
      resourceType: TResourceType;
    }): PermissionResourceRef<TResource, TQuery, TResourceType, TPluginId> {
      return {
        $$type: '@backstage/PermissionResourceRef',
        pluginId: options.pluginId,
        resourceType: options.resourceType,
        TQuery: null as TQuery,
        TResource: null as TResource,
      };
    },
  };
}
