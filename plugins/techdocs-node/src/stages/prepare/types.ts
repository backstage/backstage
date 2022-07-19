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

import type { Entity } from '@backstage/catalog-model';
import { UrlReader } from '@backstage/backend-common';
import { Logger } from 'winston';

/**
 * A unique identifier of the tree blob, usually the commit SHA or etag from the target.
 * @public
 */
export type ETag = string;

/**
 * Options for building preparers
 * @public
 */
export type PreparerConfig = {
  logger: Logger;
  reader: UrlReader;
};

/**
 * Options for configuring the content preparation process.
 * @public
 */
export type PreparerOptions = {
  /**
   * An instance of the logger
   */
  logger?: Logger;
  /**
   * see {@link ETag}
   */
  etag?: ETag;
};

/**
 * Result of the preparation step.
 * @public
 */
export type PreparerResponse = {
  /**
   * The path to directory where the tree is downloaded.
   */
  preparedDir: string;
  /**
   * see {@link ETag}
   */
  etag: ETag;
};

/**
 * Definition of a TechDocs preparer
 * @public
 */
export type PreparerBase = {
  /**
   * Given an Entity definition from the Software Catalog, go and prepare a directory
   * with contents from the location in temporary storage and return the path.
   *
   * @param entity - The entity from the Software Catalog
   * @param options - If etag is provided, it will be used to check if the target has
   *        updated since the last build.
   * @throws `NotModifiedError` when the prepared directory has not been changed since the last build.
   */
  prepare(entity: Entity, options?: PreparerOptions): Promise<PreparerResponse>;
};

/**
 * Definition for a TechDocs preparer builder
 * @public
 */
export type PreparerBuilder = {
  register(protocol: RemoteProtocol, preparer: PreparerBase): void;
  get(entity: Entity): PreparerBase;
};

/**
 * Location where documentation files are stored
 * @public
 */
export type RemoteProtocol = 'url' | 'dir';
