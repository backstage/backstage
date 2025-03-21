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

import { Entity } from '../Entity';
import { GroupEntity } from '../../kinds';
import { EntityPolicy } from './types';
import { DEFAULT_NAMESPACE } from '../constants';
import { parseEntityRef, stringifyEntityRef } from '../ref';

/**
 * DefaultParentPolicy is an EntityPolicy that updates group entities
 * with a parent of last resort. This ensures that, while we preserve
 * any existing group hierarchies, we can guarantee that there is a
 * single global root of the group hierarchy.
 *
 * @public
 */
export class GroupDefaultParentEntityPolicy implements EntityPolicy {
  private readonly parentRef: string;

  constructor(parentEntityRef: string) {
    const { kind, namespace, name } = parseEntityRef(parentEntityRef, {
      defaultKind: 'Group',
      defaultNamespace: DEFAULT_NAMESPACE,
    });

    if (kind.toLocaleUpperCase('en-US') !== 'GROUP') {
      throw new TypeError('group parent must be a group');
    }

    this.parentRef = stringifyEntityRef({
      kind: kind,
      namespace: namespace,
      name: name,
    });
  }

  async enforce(entity: Entity): Promise<Entity> {
    if (entity.kind !== 'Group') {
      return entity;
    }

    const group = entity as GroupEntity;
    if (group.spec.parent) {
      return group;
    }

    // Avoid making the parent entity it's own parent.
    if (stringifyEntityRef(group) !== this.parentRef) {
      group.spec.parent = this.parentRef;
    }

    return group;
  }
}
