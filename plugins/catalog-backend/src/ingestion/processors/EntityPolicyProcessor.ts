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

import { Entity, EntityPolicy, LocationSpec } from '@backstage/catalog-model';
import * as result from './results';
import { LocationProcessor, LocationProcessorResults } from './types';

export class EntityPolicyProcessor implements LocationProcessor {
  private readonly policy: EntityPolicy;

  constructor(policy: EntityPolicy) {
    this.policy = policy;
  }

  async *processEntity(
    entity: Entity,
    location: LocationSpec,
  ): LocationProcessorResults {
    try {
      const updatedEntity = await this.policy.enforce(entity);
      yield result.entity(location, updatedEntity);
    } catch (e) {
      yield result.generalError(location, e.toString());
    }
  }
}
