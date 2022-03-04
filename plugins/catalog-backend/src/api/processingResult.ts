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
import { EntityRelationSpec, LocationSpec } from './common';

/**
 * Factory functions for the standard processing result types.
 *
 * @public
 */
export const processingResult = Object.freeze({
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

  generalError(
    atLocation: LocationSpec,
    message: string,
  ): CatalogProcessorResult {
    return { type: 'error', location: atLocation, error: new Error(message) };
  },

  location(newLocation: LocationSpec): CatalogProcessorResult {
    return { type: 'location', location: newLocation };
  },

  entity(atLocation: LocationSpec, newEntity: Entity): CatalogProcessorResult {
    return { type: 'entity', location: atLocation, entity: newEntity };
  },

  relation(spec: EntityRelationSpec): CatalogProcessorResult {
    return { type: 'relation', relation: spec };
  },
} as const);
