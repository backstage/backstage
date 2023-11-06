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
 * This permission is used to determine if a user is allowed to add a project in bazaar
 *
 * @public
 */
export const bazaarAddPermission = createPermission({
  name: 'bazaar.project.create',
  attributes: {
    action: 'create',
  },
});

/**
 * This permission is used to determine if a user is allowed to edit a project in bazaar
 *
 * @public
 */
export const bazaarUpdatePermission = createPermission({
  name: 'bazaar.project.update',
  attributes: {
    action: 'update',
  },
});

/**
 * This permission is used to determine if a user is allowed to delete a project in bazaar
 *
 * @public
 */
export const bazaarDeletePermission = createPermission({
  name: 'bazaar.project.delete',
  attributes: {
    action: 'delete',
  },
});

/**
 * List of all Bazaar permissions
 *
 * @public
 */
export const bazaarPermissions = [
  bazaarAddPermission,
  bazaarDeletePermission,
  bazaarUpdatePermission,
];
