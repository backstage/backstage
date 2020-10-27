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
  Entity,
  EntityRelationSpec,
  LocationSpec,
} from '@backstage/catalog-model';

export type CatalogProcessor = {
  /**
   * Reads the contents of a location.
   *
   * @param location The location to read
   * @param optional Whether a missing target should trigger an error
   * @param emit A sink for items resulting from the read
   * @returns True if handled by this processor, false otherwise
   */
  readLocation?(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean>;

  /**
   * Parses a raw data buffer that was read from a location.
   *
   * @param data The data to parse
   * @param location The location that the data came from
   * @param emit A sink for items resulting from the parsing
   * @returns True if handled by this processor, false otherwise
   */
  parseData?(
    data: Buffer,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<boolean>;

  /**
   * Pre-processes an emitted entity, after it has been emitted but before it
   * has been validated.
   *
   * This type of processing usually involves enriching the entity with
   * additional data, and the input entity may actually still be incomplete
   * when the processor is invoked.
   *
   * @param entity The (possibly partial) entity to process
   * @param location The location that the entity came from
   * @param emit A sink for auxiliary items resulting from the processing
   * @returns The same entity or a modified version of it
   */
  preProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity>;

  /**
   * Post-processes an emitted entity, after it has been validated.
   *
   * @param entity The entity to process
   * @param location The location that the entity came from
   * @param emit A sink for auxiliary items resulting from the processing
   * @returns The same entity or a modified version of it
   */
  postProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity>;

  /**
   * Handles an emitted error.
   *
   * @param error The error
   * @param location The location where the error occurred
   * @param emit A sink for items resulting from this handling
   * @returns Nothing
   */
  handleError?(
    error: Error,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<void>;
};

export type CatalogProcessorEmit = (generated: CatalogProcessorResult) => void;

export type CatalogProcessorLocationResult = {
  type: 'location';
  location: LocationSpec;
  optional: boolean;
};

export type CatalogProcessorDataResult = {
  type: 'data';
  data: Buffer;
  location: LocationSpec;
};

export type CatalogProcessorEntityResult = {
  type: 'entity';
  entity: Entity;
  location: LocationSpec;
};

export type CatalogProcessorRelationResult = {
  type: 'relation';
  relation: EntityRelationSpec;
  entityRef?: string;
};

export type CatalogProcessorErrorResult = {
  type: 'error';
  error: Error;
  location: LocationSpec;
};

export type CatalogProcessorResult =
  | CatalogProcessorLocationResult
  | CatalogProcessorDataResult
  | CatalogProcessorEntityResult
  | CatalogProcessorRelationResult
  | CatalogProcessorErrorResult;
