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

import { DateTime } from 'luxon';
import { JsonValue } from '@backstage/types';
import {
  FactRetrieverContext,
  FactSchema,
  TechInsightFact,
} from '@backstage/plugin-tech-insights-node';

/**
 * @public
 *
 * Response type for checks.
 */
export interface CheckResponse {
  /**
   * Identifier of the Check
   */
  id: string;
  /**
   * Type identifier for the check.
   * Can be used to determine storage options, logical routing to correct FactChecker implementation
   * or to help frontend render correct component types based on this
   */
  type: string;
  /**
   * Human readable name of the Check
   */
  name: string;
  /**
   * Description of the Check
   */
  description: string;

  /**
   * A collection of references to fact rows used to run this checks against
   */
  factIds: string[];

  /**
   * Metadata related to a check.
   * Can contain links, additional description texts and other actionable data.
   *
   * Currently loosely typed, but in the future when patterns emerge, key shapes can be defined
   */
  metadata?: Record<string, any>;
}

/**
 * @public
 *
 * Individual fact response type.
 * Keyed by the name of the fact
 */
export type FactResponse = {
  [id: string]: {
    /**
     * Reference and unique identifier of the fact row
     */
    id: string;
    /**
     * Type of the individual fact value
     *
     * Numbers are split into integers and floating point values.
     * `set` indicates a collection of values
     */
    type: 'integer' | 'float' | 'string' | 'boolean' | 'datetime' | 'set';

    /**
     * Description of the individual fact
     */
    description: string;

    /**
     * Actual value of the fact
     */
    value: number | string | boolean | DateTime | [];

    /**
     * An optional SemVer version identifying when this fact was added to the FactSchema
     */
    since?: string;

    /**
     * Metadata related to an individual fact.
     * Can contain links, additional description texts and other actionable data.
     *
     * Currently loosely typed, but in the future when patterns emerge, key shapes can be defined
     */
    metadata?: Record<string, any>;
  };
};

/**
 * FactRetriever interface
 *
 * @public
 */
export interface FactRetriever {
  /**
   * A unique identifier of the retriever.
   * Used to identify and store individual facts returned from this retriever
   * and schemas defined by this retriever.
   */
  id: string;

  /**
   * Semver string indicating the version of this fact retriever
   * This version is used to determine if the schema this fact retriever matches the data this fact retriever provides.
   *
   * Should be incremented on changes to returned data from the handler or if the schema changes.
   */
  version: string;

  /**
   * A short display title for the fact retriever to be used in the interface
   */
  title: string;

  /**
   * A short display description for the fact retriever to be used in the interface.
   */
  description: string;

  /**
   * Handler function that needs to be implemented to retrieve fact values for entities.
   *
   * @param ctx - FactRetrieverContext which can be used to retrieve config and contact integrations
   * @returns - A collection of TechInsightFacts grouped by entities.
   */
  handler: (ctx: FactRetrieverContext) => Promise<TechInsightFact[]>;

  /**
   * A fact schema defining the shape of data returned from the handler method for each entity
   */
  schema: FactSchema;

  /**
   * An optional object/array of objects of entity filters to indicate if this fact retriever is valid for an entity type.
   * If omitted, the retriever should apply to all entities.
   *
   * Should be defined for example:
   *   \{ field: 'kind', values: \['component'\] \}
   *   \{ field: 'metadata.name', values: \['component-1', 'component-2'\] \}
   */
  entityFilter?:
    | Record<string, string | symbol | (string | symbol)[]>[]
    | Record<string, string | symbol | (string | symbol)[]>;
}

/**
 * Generic CheckResult
 *
 * Contains information about the facts used to calculate the check result
 * and information about the check itself. Both may include metadata to be able to display additional information.
 * A collection of these should be parseable by the frontend to display scorecards
 *
 * @public
 */
export type CheckResult = {
  facts: FactResponse;
  check: CheckResponse;
  result: JsonValue;
};

/**
 * CheckResult of type Boolean.
 *
 * @public
 */
export interface BooleanCheckResult extends CheckResult {
  result: boolean;
}

/**
 * Response type for bulk check opretation. Contains a list of entities and their respective check results.
 *
 * @public
 */
export type BulkCheckResponse = Array<{
  entity: string;
  results: CheckResult[];
}>;
