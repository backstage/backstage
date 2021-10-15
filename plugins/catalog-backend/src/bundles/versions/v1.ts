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

import { EntityPolicy, Validators } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { Logger } from 'winston';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  PlaceholderResolver,
} from '../../ingestion';
import { RefreshIntervalFunction } from '../../processing/refresh';
import { EntityProvider } from '../../providers/types';

/**
 * The environment that V1 bundles can act within.
 */
export interface CatalogBundleV1Environment {
  /**
   * The catalog plugin database, initialized and ready.
   */
  database: Knex;

  /**
   * A logger, scoped to the catalog plugin.
   */
  logger: Logger;
}

/**
 * The environment that V1 bundles can act within.
 */
export interface CatalogBundleV1Hooks {
  /**
   * Adds policies that are used to validate entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBundleV1Environment#setFieldFormatValidators} instead.
   *
   * @param policies - One or more policies
   */
  addEntityPolicy(...policies: EntityPolicy[]): void;

  /**
   * Refresh interval determines how often entities should be refreshed.
   * Seconds provided will be multiplied by 1.5
   * The default refresh duration is 100-150 seconds.
   * setting this too low will potentially deplete request quotas to upstream services.
   */
  setRefreshIntervalSeconds(seconds: number): void;

  /**
   * Overwrites the default refresh interval function used to spread
   * entity updates in the catalog.
   */
  setRefreshInterval(refreshInterval: RefreshIntervalFunction): void;

  /**
   * Sets what policies to use for validation of entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBundleV1Environment#setFieldFormatValidators} instead.
   *
   * This function replaces the default set of policies; use with care.
   *
   * @param policies - One or more policies
   */
  replaceEntityPolicies(policies: EntityPolicy[]): void;

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key - The key that identifies the placeholder, e.g. "file"
   * @param resolver - The resolver that gets values for this placeholder
   */
  setPlaceholderResolver(key: string, resolver: PlaceholderResolver): void;

  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * This function has no effect if used together with
   * {@link CatalogBundleV1Environment#replaceEntityPolicies}.
   *
   * @param validators - The (subset of) validators to set
   */
  setFieldFormatValidators(validators: Partial<Validators>): void;

  /**
   * Adds or replaces entity providers. These are responsible for bootstrapping
   * the list of entities out of original data sources. For example, there is
   * one entity source for the config locations, and one for the database
   * stored locations. If you ingest entities out of a third party system, you
   * may want to implement that in terms of an entity provider as well.
   *
   * @param providers - One or more entity providers
   */
  addEntityProvider(...providers: EntityProvider[]): void;

  /**
   * Adds entity processors. These are responsible for reading, parsing, and
   * processing entities before they are persisted in the catalog.
   *
   * @param processors - One or more processors
   */
  addProcessor(...processors: CatalogProcessor[]): void;

  /**
   * Sets what entity processors to use. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog.
   *
   * This function replaces the default set of processors; use with care.
   *
   * @param processors - One or more processors
   */
  replaceProcessors(processors: CatalogProcessor[]): void;

  /**
   * Sets up the catalog to use a custom parser for entity data.
   *
   * This is the function that gets called immediately after some raw entity
   * specification data has been read from a remote source, and needs to be
   * parsed and emitted as structured data.
   *
   * @param parser - The custom parser
   */
  setEntityDataParser(parser: CatalogProcessorParser): void;
}

/**
 * The initial bundle output shape, simply inverting control and wrapping the
 * original builder API.
 *
 * @public
 */
export interface CatalogBundleV1 {
  version: 1;
  name: string;
  init(options: {
    environment: CatalogBundleV1Environment;
    hooks: CatalogBundleV1Hooks;
  }): void | Promise<void>;
}
