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

import { InputError, NotFoundError } from '@backstage/errors';
import { Entity } from '@backstage/catalog-model';
import { CatalogProcessorResult } from './processor';
import { EntityRelationSpec } from './common';
import { LocationSpec } from '@backstage/plugin-catalog-common';

/**
 * Factory functions for the standard processing result types.
 *
 * @public
 */
export const processingResult = Object.freeze({
  /**
   * Associates a NotFoundError with the processing state of the current entity.
   */
  notFoundError(
    atLocation: LocationSpec,
    message: string,
  ): CatalogProcessorResult {
    return {
      type: 'error',
      location: atLocation,
      error: new NotFoundError(message),
    };
  },

  /**
   * Associates an InputError with the processing state of the current entity.
   */
  inputError(
    atLocation: LocationSpec,
    message: string,
  ): CatalogProcessorResult {
    return {
      type: 'error',
      location: atLocation,
      error: new InputError(message),
    };
  },

  /**
   * Associates a general Error with the processing state of the current entity.
   */
  generalError(
    atLocation: LocationSpec,
    message: string,
  ): CatalogProcessorResult {
    return { type: 'error', location: atLocation, error: new Error(message) };
  },

  /**
   * Emits a location. In effect, this is analogous to emitting a Location kind
   * child entity. This is commonly used in discovery processors. Do not use
   * this while processing Location entities.
   */
  location(newLocation: LocationSpec): CatalogProcessorResult {
    return { type: 'location', location: newLocation };
  },

  /**
   * Emits a child of the current entity, associated with a certain location.
   */
  entity(
    atLocation: LocationSpec,
    newEntity: Entity,
    options?: {
      /**
       * Sets the location key of the emitted entity, overriding the default one derived from the location.
       *
       * To set a `null` location key the value `null` must be used.
       */
      locationKey?: string | null;
    },
  ): CatalogProcessorResult {
    return {
      type: 'entity',
      location: atLocation,
      entity: newEntity,
      locationKey: options?.locationKey,
    };
  },

  /**
   * Emits a relation owned by the current entity. The relation does not have to
   * start or end at the current entity. The relation only lives for as long as
   * the current entity lives.
   */
  relation(spec: EntityRelationSpec): CatalogProcessorResult {
    return { type: 'relation', relation: spec };
  },

  /**
   * Associates the given refresh key with the current entity. The effect of
   * this is that the entity will be marked for refresh when such requests are
   * made.
   */
  refresh(key: string): CatalogProcessorResult {
    return { type: 'refresh', key };
  },
} as const);
