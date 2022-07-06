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
import { DateTime, Duration, DurationLike } from 'luxon';
import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';
import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { Logger } from 'winston';
import { FactRetriever } from '@backstage/plugin-tech-insights-common';

/**
 * A container for facts. The shape of the fact records needs to correspond to the FactSchema with same `ref` value.
 * Each container contains a reference to an entity which can be a Backstage entity or a generic construct
 * outside of backstage with same shape.
 *
 * Container may contain multiple individual facts and their values
 *
 * @public
 */
export type TechInsightFact = {
  /**
   * Entity reference that this fact relates to
   */
  entity: {
    namespace: string;
    kind: string;
    name: string;
  };

  /**
   * A collection of fact values as key value pairs.
   *
   * Key indicates fact name as it is defined in FactSchema
   */
  facts: Record<
    string,
    | number
    | string
    | boolean
    | DateTime
    | number[]
    | string[]
    | boolean[]
    | DateTime[]
    | JsonValue
  >;

  /**
   * Optional timestamp value which can be used to override retrieval time of the fact row.
   * Otherwise when stored into data storage, defaults to current time
   */
  timestamp?: DateTime;
};

/**
 * Response type used when returning from database and API.
 * Adds a field for ref for easier usage
 *
 * @public
 */
export type FlatTechInsightFact = TechInsightFact & {
  /**
   * Reference and unique identifier of the fact row
   */
  id: string;
};

/**
 * A record type to specify individual fact shapes
 *
 * Used as part of a schema to validate, identify and generically construct usage implementations
 * of individual fact values in the system.
 *
 * @public
 */
export type FactSchema = {
  /**
   * Name of the fact
   */
  [name: string]: {
    /**
     * Type of the individual fact value
     *
     * Numbers are split into integers and floating point values.
     * `set` indicates a collection of values, `object` indicates JSON serializable value
     */
    type:
      | 'integer'
      | 'float'
      | 'string'
      | 'boolean'
      | 'datetime'
      | 'set'
      | 'object';

    /**
     * A description of this individual fact value
     */
    description: string;

    /**
     * Optional semver string to indicate when this specific fact definition was added to the schema
     */
    since?: string;

    /**
     * Metadata related to an individual fact.
     * Can contain links, additional description texts and other actionable data.
     *
     * Currently loosely typed, but in the future when patterns emerge, key shapes can be defined
     *
     * examples:
     * ```
     * \{
     *   link: 'https://sonarqube.mycompany.com/fix-these-issues',
     *   suggestion: 'To affect this value, you can do x, y, z',
     *   minValue: 0
     * \}
     * ```
     */
    metadata?: Record<string, any>;
  };
};

/**
 * @public
 *
 * FactRetrieverContext injected into individual handler methods of FactRetriever implementations.
 * The context can be used to construct logic to retrieve entities, contact integration points
 * and fetch and calculate fact values from external sources.
 */
export type FactRetrieverContext = {
  config: Config;
  discovery: PluginEndpointDiscovery;
  logger: Logger;
  tokenManager: TokenManager;
  entityFilter?:
    | Record<string, string | symbol | (string | symbol)[]>[]
    | Record<string, string | symbol | (string | symbol)[]>;
};

/**
 * A Luxon duration like object for time to live value
 *
 * @public
 * @example
 * \{ timeToLive: 1209600000 \}
 * \{ timeToLive: \{ weeks: 4 \} \}
 *
 **/
export type TTL = { timeToLive: DurationLike };

/**
 * A maximum number for items to be kept in the database for each fact retriever/entity pair
 *
 * @public
 * @example
 * \{ maxItems: 10 \}
 *
 **/
export type MaxItems = { maxItems: number };

/**
 * A fact lifecycle definition. Determines which strategy to use to purge expired facts from the database.
 *
 * @public
 */
export type FactLifecycle = TTL | MaxItems;

/**
 * A flat serializable structure for Facts.
 * Containing information about fact schema, version, id, and entity filters
 *
 * @public
 */
export type FactSchemaDefinition = Omit<FactRetriever, 'handler'>;

/**
 * Registration of a fact retriever
 * Used to add and schedule individual fact retrievers to the fact retriever engine.
 *
 * @public
 */
export type FactRetrieverRegistration = {
  /**
   * Actual FactRetriever implementation
   */
  factRetriever: FactRetriever;

  /**
   * Cron expression to indicate when the retriever should be triggered.
   * Defaults to a random point in time every 24h
   *
   */
  cadence?: string;

  /**
   * A duration to determine how long the fact retriever should be allowed to run,
   * defaults to 5 minutes.
   *
   */
  timeout?: Duration;

  /**
   * Fact lifecycle definition
   *
   * If defined this value will be used to determine expired items which will deleted when this fact retriever is run
   */
  lifecycle?: FactLifecycle;
};
