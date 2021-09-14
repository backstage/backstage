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

import { Config } from '@backstage/config';
import { DateTime } from 'luxon';
import {
  DynamicFactCallback,
  Event,
  FactOptions,
  TopLevelCondition,
} from 'json-rules-engine';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

export type TechInsightFact = {
  ref: string;
  entity: {
    namespace: string;
    kind: string;
    name: string;
  };
  facts: Record<string, number | string | boolean | DateTime>;
};

type FactValueDefinitions = {
  [key: string]: {
    type: 'integer' | 'float' | 'string' | 'boolean' | 'datetime';
    description?: string;
    since?: string;
  };
};
export type FactSchema = {
  version: string;
  schema: FactValueDefinitions;
};

export type FactRetrieverContext = {
  config: Config;
  discovery: PluginEndpointDiscovery;
  // ...others
};

// TODO: Possibly add return type type param
export interface FactRetriever {
  ref: string;

  handler: (ctx: FactRetrieverContext) => Promise<TechInsightFact[]>;

  schema: FactSchema;
}

export type FactRetrieverRegistration = {
  factRetriever: FactRetriever;

  /**
   * Cron expression to indicate when the retriever should be triggered.
   * Defaults to a random point in time every 24h
   *
   * To be complemented with an event listening solution when bus across the app is implemented
   */
  cadence?: string;

  // Other options integrator could find helpful
};

/**
 * Generic CheckResult
 *
 * Should be parseable by the frontend to display a check result.
 * A collection of these should be parseable by the frontend to display scorecards
 */
export type CheckResult = {
  value: boolean;
  text: string;
  // Possibly fact data used to calculate the result of this check
  // A check could be good here as well but since implementation might differ, tricky to define a shape for
};

/**
 * Specific to JSON rule engine impl
 */

// TODO: wrap types from json-rules-engine to some more specific internal types?
interface DynamicFact<T = unknown> {
  id: string;
  calculationMethod: DynamicFactCallback<T> | T;
  options?: FactOptions;
}

export type Rule = {
  conditions: TopLevelCondition;
  event: Event;
  name?: string;
  priority?: number;
};

export interface TechInsightCheck {
  name: string;
  description?: string;
  factRefs: string[];
}

export interface TechInsightJsonRuleCheck extends TechInsightCheck {
  rule: Rule;
  dynamicFacts?: DynamicFact[];
}
