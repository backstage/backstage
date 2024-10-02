/*
 * Copyright 2022 The Backstage Authors
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
import {
  AnalyzeLocationExistingEntity,
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';
import { JsonValue } from '@backstage/types';
import { CatalogProcessorEmit } from '../api';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

/**
 * Entities that are not yet processed.
 * @public
 */
export type DeferredEntity = {
  entity: Entity;
  locationKey?: string;
};

/** @public */
export type PlaceholderResolverRead = (url: string) => Promise<Buffer>;

/** @public */
export type PlaceholderResolverResolveUrl = (
  url: string,
  base: string,
) => string;

/** @public */
export type PlaceholderResolverParams = {
  key: string;
  value: JsonValue;
  baseUrl: string;
  read: PlaceholderResolverRead;
  resolveUrl: PlaceholderResolverResolveUrl;
  emit: CatalogProcessorEmit;
};

/** @public */
export type PlaceholderResolver = (
  params: PlaceholderResolverParams,
) => Promise<JsonValue>;

/** @public */
export type LocationAnalyzer = {
  /**
   * Generates an entity configuration for given git repository. It's used for
   * importing new component to the backstage app.
   *
   * @param location - Git repository to analyze and generate config for.
   */
  analyzeLocation(
    location: AnalyzeLocationRequest,
    credentials: BackstageCredentials,
  ): Promise<AnalyzeLocationResponse>;
};

/** @public */
export type AnalyzeOptions = {
  url: string;
  catalogFilename?: string;
};

/** @public */
export type ScmLocationAnalyzer = {
  /** The method that decides if this analyzer can work with the provided url */
  supports(url: string): boolean;
  /** This function can return an array of already existing entities */
  analyze(options: AnalyzeOptions): Promise<{
    /** Existing entities in the analyzed location */
    existing: AnalyzeLocationExistingEntity[];
  }>;
};
