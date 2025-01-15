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

import { Permission } from '@backstage/plugin-permission-common';
import { PermissionRule } from '@backstage/plugin-permission-node';

/**
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
type NoInfer<T> = T extends infer S ? S : never;

/**
 * Options for adding a resource type to the permission system.
 *
 * @public
 */
export type PermissionsRegistryServiceAddResourceTypeOptions<
  TResourceType extends string,
  TResource,
> = {
  /**
   * The identifier for the resource type.
   */
  resourceType: TResourceType;

  /**
   * Permissions that are available for this resource type.
   */
  permissions?: Array<Permission>;

  /**
   * Permission rules that are available for this resource type.
   */
  rules: PermissionRule<TResource, any, NoInfer<TResourceType>>[];

  /**
   * The function used to load associated resources based in the provided
   * references.
   *
   * @remarks
   *
   * If this function is not provided the permission system will not be able to
   * resolve conditional decisions except when requesting resources directly
   * from the plugin.
   */
  getResources?(resourceRefs: string[]): Promise<Array<TResource | undefined>>;
};

/**
 * Permission system integration for registering resources and permissions.
 *
 * See the {@link https://backstage.io/docs/permissions/overview | permissions documentation}
 * and the {@link https://backstage.io/docs/backend-system/core-services/permission-integrations | service documentation}
 * for more details.
 *
 * @public
 */
export interface PermissionsRegistryService {
  /**
   * Add permissions for this plugin to the permission system.
   */
  addPermissions(permissions: Permission[]): void;

  /**
   * Adds a set of permission rules to the permission system for a resource type
   * that is owned by this plugin.
   *
   * @remarks
   *
   * Rules should be created using corresponding `create*PermissionRule`
   * functions exported by plugins, who in turn are created with
   * `makeCreatePermissionRule`.
   *
   * Rules can be added either directly by the plugin itself or through a plugin
   * module.
   */
  addPermissionRules(rules: PermissionRule<any, any, string>[]): void;

  /**
   * Add a new resource type that is owned by this plugin to the permission
   * system.
   *
   * @remarks
   *
   * To make this concrete, we can use the Backstage software catalog as an
   * example. The catalog has conditional rules around access to specific
   * _entities_ in the catalog. The _type_ of resource is captured here as
   * `resourceType`, a string identifier (`catalog-entity` in this example) that
   * can be provided with permission definitions. This is merely a _type_ to
   * verify that conditions in an authorization policy are constructed
   * correctly, not a reference to a specific resource.
   *
   * The `rules` parameter is an array of
   * {@link @backstage/plugin-permission-node#PermissionRule}s that introduce
   * conditional filtering logic for resources; for the catalog, these are
   * things like `isEntityOwner` or `hasAnnotation`. Rules describe how to
   * filter a list of resources, and the `conditions` returned allow these rules
   * to be applied with specific parameters (such as 'group:default/team-a', or
   * 'backstage.io/edit-url').
   *
   * The `getResources` argument should load resources based on a reference
   * identifier. For the catalog, this is an
   * [entity reference](https://backstage.io/docs/features/software-catalog/references#string-references).
   * For other plugins, this can be any serialized format. This is used to add a
   * permissions registry API via the HTTP router service. This API will be
   * called by the `permission-backend` when authorization conditions relating
   * to this plugin need to be evaluated.
   */
  addResourceType<const TResourceType extends string, TResource>(
    options: PermissionsRegistryServiceAddResourceTypeOptions<
      TResourceType,
      TResource
    >,
  ): void;
}
