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

import { CatalogProcessor } from '../ingestion';
import { EntityProvider } from '../providers';
import {
  CatalogBundleV1,
  CatalogBundleV1Environment,
  CatalogBundleV1Hooks,
} from './versions/v1';

/**
 * The input shape of the current version of bundles.
 */
export interface CreateBundleDefinition {
  /**
   * A name for this bundle.
   *
   * This should be a stable, identifier-like string that may be used in
   * several subsystems such as monitoring, logging etc.
   */
  name: string;

  /**
   * A list of processors exposed by this bundle.
   *
   * You may specify either direct instances or factory functions.
   */
  processors?: Array<
    | CatalogProcessor
    | ((
        environment: CatalogBundleV1Environment,
      ) => CatalogProcessor | Promise<CatalogProcessor>)
  >;

  /**
   * A list of entity providers exposed by this bundle.
   *
   * You may specify either direct instances or factory functions.
   */
  entityProviders?: Array<
    | EntityProvider
    | ((
        environment: CatalogBundleV1Environment,
      ) => EntityProvider | Promise<EntityProvider>)
  >;

  /**
   * Lets your plugin perform more complex startup initialization if needed.
   *
   * @param options - The catalog environment and hooks
   */
  init?(options: {
    environment: CatalogBundleV1Environment;
    hooks: CatalogBundleV1Hooks;
  }): void | Promise<void>;
}

/**
 * Creates a bundle of functionality that can be installed in the catalog.
 *
 * @param definition - The definition of the bundle
 * @returns A bundle that can be installed in the catalog
 */
export function createBundle(
  definition: CreateBundleDefinition,
): CatalogBundleV1 {
  const { name, processors, entityProviders, init } = definition;

  return {
    version: 1,
    name,
    async init(options) {
      if (processors?.length) {
        for (const processor of processors) {
          const instance =
            typeof processor === 'function'
              ? await processor(options.environment)
              : processor;
          options.hooks.addProcessor(instance);
        }
      }

      if (entityProviders?.length) {
        for (const provider of entityProviders) {
          const instance =
            typeof provider === 'function'
              ? await provider(options.environment)
              : provider;
          options.hooks.addEntityProvider(instance);
        }
      }

      if (init) {
        await init(options);
      }
    },
  };
}
