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

import { Entity, LocationSpec } from '@backstage/catalog-model';

export type LocationProcessor = {
  process(
    item: LocationProcessorResult,
    emit: LocationProcessorEmit,
  ): Promise<LocationProcessorResult | undefined>;
};

export type LocationProcessorEmit = (
  generated: LocationProcessorResult,
) => void;

export type LocationProcessorLocationResult = {
  type: 'location';
  location: LocationSpec;
  optional: boolean;
};

export type LocationProcessorDataResult = {
  type: 'data';
  data: Buffer;
  location: LocationSpec;
};

export type LocationProcessorEntityResult = {
  type: 'entity';
  entity: Entity;
  location: LocationSpec;
};

export type LocationProcessorErrorResult = {
  type: 'error';
  error: Error;
  location: LocationSpec;
};

export type LocationProcessorResult =
  | LocationProcessorLocationResult
  | LocationProcessorDataResult
  | LocationProcessorEntityResult
  | LocationProcessorErrorResult;
