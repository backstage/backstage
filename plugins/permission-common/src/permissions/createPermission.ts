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

import {
  BasicPermission,
  Permission,
  PermissionAttributes,
  PolicyDecision,
  ResourcePermission,
} from '../types';

/**
 * Utility function for creating a valid {@link ResourcePermission}, inferring
 * the appropriate type and resource type parameter.
 *
 * @public
 */
export function createPermission<TResourceType extends string>(input: {
  name: string;
  attributes: PermissionAttributes;
  resourceType: TResourceType;
  defaultDecision?: PolicyDecision;
}): ResourcePermission<TResourceType>;
/**
 * Utility function for creating a valid {@link BasicPermission}.
 *
 * @public
 */
export function createPermission(input: {
  name: string;
  attributes: PermissionAttributes;
  defaultDecision?: PolicyDecision;
}): BasicPermission;

export function createPermission({
  name,
  attributes,
  resourceType,
  defaultDecision,
}: {
  name: string;
  attributes: PermissionAttributes;
  resourceType?: string;
  defaultDecision?: PolicyDecision;
}): Permission {
  if (resourceType) {
    return {
      type: 'resource',
      name,
      attributes,
      resourceType,
      defaultDecision,
    };
  }

  return {
    type: 'basic',
    name,
    attributes,
    defaultDecision,
  };
}
