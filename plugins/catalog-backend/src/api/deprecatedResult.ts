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

// NOTE: This entire file is deprecated and should be eventually removed along with the `result` export

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function notFoundError(
  atLocation: LocationSpec,
  message: string,
): CatalogProcessorResult {
  return {
    type: 'error',
    location: atLocation,
    error: new NotFoundError(message),
  };
}

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function inputError(
  atLocation: LocationSpec,
  message: string,
): CatalogProcessorResult {
  return {
    type: 'error',
    location: atLocation,
    error: new InputError(message),
  };
}

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function generalError(
  atLocation: LocationSpec,
  message: string,
): CatalogProcessorResult {
  return { type: 'error', location: atLocation, error: new Error(message) };
}

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function location(
  newLocation: LocationSpec,
  _optional?: boolean,
): CatalogProcessorResult {
  return { type: 'location', location: newLocation };
}

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function entity(
  atLocation: LocationSpec,
  newEntity: Entity,
): CatalogProcessorResult {
  return { type: 'entity', location: atLocation, entity: newEntity };
}

/**
 * @public
 * @deprecated import the processingResult symbol instead and use its fields
 */
export function relation(spec: EntityRelationSpec): CatalogProcessorResult {
  return { type: 'relation', relation: spec };
}
