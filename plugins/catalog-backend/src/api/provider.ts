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

import { DeferredEntity } from '../processing';

/**
 * @public
 * A 'full' mutation replaces all existing entities created by this entity provider with new ones.
 * A 'delta' mutation can both add and remove entities provided by this provider. Previously provided
 * entities from a 'full' mutation are not removed.
 */
export type EntityProviderMutation =
  | { type: 'full'; entities: DeferredEntity[] }
  | { type: 'delta'; added: DeferredEntity[]; removed: DeferredEntity[] };

/**
 * The EntityProviderConnection is the connection between the catalog and the entity provider.
 * The EntityProvider use this connection to add and remove entities from the catalog.
 * @public
 */
export interface EntityProviderConnection {
  /**
   * Applies either a full or delta update to the catalog engine.
   */
  applyMutation(mutation: EntityProviderMutation): Promise<void>;
}

/**
 * An EntityProvider is able to provide entities to the catalog.
 * See https://backstage.io/docs/features/software-catalog/life-of-an-entity for more details.
 * @public
 */
export interface EntityProvider {
  /** Unique provider name used internally for caching. */
  getProviderName(): string;
  /** Connect is called upon initialization by the catalog engine. */
  connect(connection: EntityProviderConnection): Promise<void>;
}
