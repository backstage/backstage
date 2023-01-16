/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from './Entity';
import { EntityStatus } from './EntityStatus';

/**
 * A version of the {@link Entity} type that contains unstable alpha fields.
 *
 * @remarks
 *
 * Available via the `@backstage/catalog-model/alpha` import.
 *
 * @alpha
 */
export interface AlphaEntity extends Entity {
  /**
   * The current status of the entity, as claimed by various sources.
   *
   * The keys are implementation defined and the values can be any JSON object
   * with semantics that match that implementation.
   */
  status?: EntityStatus;
}
