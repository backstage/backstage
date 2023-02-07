/*
 * Copyright 2023 The Backstage Authors
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
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { ValidateEntityResponse } from '@backstage/catalog-client';
import { LocationSpec } from '@backstage/plugin-catalog-common';

export type ValidationOutputError = {
  type: 'error';
  processingError: string;
};

export type ValidationOutputOk = {
  type: 'valid';
  entity: Entity;
  response: ValidateEntityResponse;
};

export type ValidationOutput = ValidationOutputOk | ValidationOutputError;

export type EntityRelationSpec = {
  /**
   * The source entity of this relation.
   */
  source: CompoundEntityRef;

  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The target entity of this relation.
   */
  target: CompoundEntityRef;
};

type CatalogProcessorLocationResult = {
  type: 'location';
  location: LocationSpec;
};

type CatalogProcessorEntityResult = {
  type: 'entity';
  entity: Entity;
  location: LocationSpec;
};

type CatalogProcessorRelationResult = {
  type: 'relation';
  relation: EntityRelationSpec;
};

type CatalogProcessorErrorResult = {
  type: 'error';
  error: Error;
  location: LocationSpec;
};

type CatalogProcessorRefreshKeysResult = {
  type: 'refresh';
  key: string;
};

export type CatalogProcessorResult =
  | CatalogProcessorLocationResult
  | CatalogProcessorEntityResult
  | CatalogProcessorRelationResult
  | CatalogProcessorErrorResult
  | CatalogProcessorRefreshKeysResult;
