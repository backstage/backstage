/*
 * Copyright 2020 Spotify AB
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
  DefaultNamespaceEntityPolicy,
  Entity,
  FieldFormatEntityPolicy,
  NoForeignRootFieldsEntityPolicy,
  ReservedFieldsEntityPolicy,
  SchemaValidEntityPolicy,
} from './entity';
import {
  ComponentEntityV1beta1Policy,
  LocationEntityV1beta1Policy,
} from './kinds';
import { EntityPolicy } from './types';

// Helper that requires that all of a set of policies can be successfully
// applied
class AllEntityPolicies implements EntityPolicy {
  constructor(private readonly policies: EntityPolicy[]) {}

  async enforce(entity: Entity): Promise<Entity> {
    let result = entity;
    for (const policy of this.policies) {
      result = await policy.enforce(entity);
    }
    return result;
  }
}

// Helper that requires that at least one of a set of policies can be
// successfully applied
class AnyEntityPolicy implements EntityPolicy {
  constructor(private readonly policies: EntityPolicy[]) {}

  async enforce(entity: Entity): Promise<Entity> {
    for (const policy of this.policies) {
      try {
        return await policy.enforce(entity);
      } catch {
        continue;
      }
    }
    throw new Error(`The entity did not match any known policy`);
  }
}

export class EntityPolicies implements EntityPolicy {
  private readonly policy: EntityPolicy;

  static defaultPolicies(): EntityPolicy {
    return EntityPolicies.allOf([
      EntityPolicies.allOf([
        new SchemaValidEntityPolicy(),
        new DefaultNamespaceEntityPolicy(),
        new NoForeignRootFieldsEntityPolicy(),
        new FieldFormatEntityPolicy(),
        new ReservedFieldsEntityPolicy(),
      ]),
      EntityPolicies.anyOf([
        new ComponentEntityV1beta1Policy(),
        new LocationEntityV1beta1Policy(),
      ]),
    ]);
  }

  static allOf(policies: EntityPolicy[]): EntityPolicy {
    return new AllEntityPolicies(policies);
  }

  static anyOf(policies: EntityPolicy[]): EntityPolicy {
    return new AnyEntityPolicy(policies);
  }

  constructor(policy: EntityPolicy = EntityPolicies.defaultPolicies()) {
    this.policy = policy;
  }

  enforce(entity: Entity): Promise<Entity> {
    return this.policy.enforce(entity);
  }
}
