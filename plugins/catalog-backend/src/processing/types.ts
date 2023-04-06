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

import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import {
  DeferredEntity,
  EntityRelationSpec,
} from '@backstage/plugin-catalog-node';

/**
 * The request to process an entity.
 * @public
 */
export type EntityProcessingRequest = {
  entity: Entity;
  state?: JsonObject; // Versions for multiple deployments etc
};

/**
 * The result of processing an entity.
 * @internal
 */
export type EntityProcessingResult =
  | {
      ok: true;
      state: JsonObject;
      completedEntity: Entity;
      deferredEntities: DeferredEntity[];
      relations: EntityRelationSpec[];
      refreshKeys: RefreshKeyData[];
      errors: Error[];
    }
  | {
      ok: false;
      errors: Error[];
    };

/**
 * A string to associate to the entity itself.
 */
export type RefreshKeyData = {
  key: string;
};

/**
 * Responsible for executing the individual processing steps in order to fully process an entity.
 */
export interface CatalogProcessingOrchestrator {
  process(request: EntityProcessingRequest): Promise<EntityProcessingResult>;
}

/**
 * Represents the engine that drives the processing loops. Some backend
 * instances may choose to not call start, if they focus only on API
 * interactions.
 *
 * @public
 */
export interface CatalogProcessingEngine {
  start(): Promise<void>;
  stop(): Promise<void>;
}
