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
 * A 'full' mutation replaces all existing entities created by this entity provider with new ones.
 * A 'delta' mutation can both add and remove entities provided by this provider. Previously provided
 * entities from a 'full' mutation are not removed.
 *
 * @public
 */
export type EntityProviderMutation =
  | {
      type: 'full';
      entities: DeferredEntity[];
    }
  | {
      type: 'delta';
      added: DeferredEntity[];
      removed: (DeferredEntity | { entityRef: string; locationKey?: string })[];
    };

/**
 * The options given to an entity refresh operation.
 *
 * @public
 */
export type EntityProviderRefreshOptions = {
  keys: string[];
};

/**
 * The connection between the catalog and the entity provider.
 * Entity providers use this connection to add and remove entities from the catalog.
 *
 * @public
 */
export interface EntityProviderConnection {
  /**
   * Applies either a full or a delta update to the catalog engine.
   */
  applyMutation(mutation: EntityProviderMutation): Promise<void>;

  /**
   * Schedules a refresh on all of the entities that have a matching refresh key associated with the provided keys.
   */
  refresh(options: EntityProviderRefreshOptions): Promise<void>;
}

/**
 * An entity provider is able to provide entities to the catalog.
 * See https://backstage.io/docs/features/software-catalog/life-of-an-entity for more details.
 *
 * @public
 */
export interface EntityProvider {
  /**
   * The name of the provider, which must be unique for all providers that are
   * active in a catalog, and stable over time since emitted entities are
   * related to the provider by this name.
   */
  getProviderName(): string;
  /**
   * Called upon initialization by the catalog engine.
   */
  connect(connection: EntityProviderConnection): Promise<void>;
}
