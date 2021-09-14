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

import { FactRetrieverEngine } from './FactRetrieverEngine';
import {
  FactChecker,
  JsonRulesEngineFactChecker,
} from './JsonRulesEngineFactChecker';
import { Logger } from 'winston';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import {
  FactRetrieverRegistration,
  TechInsightCheck,
  TechInsightJsonRuleCheck,
} from '../types';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import {
  TechInsightsDatabase,
  TechInsightsStore,
} from './TechInsightsDatabase';

export interface TechInsightsOptions {
  logger: Logger;
  factRetrievers: FactRetrieverRegistration[];
  checks: TechInsightJsonRuleCheck[];
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
}

export type TechInsightsContext<CheckType extends TechInsightCheck> = {
  factRetrieverEngine: FactRetrieverEngine;
  factChecker: FactChecker<CheckType>;
  repository: TechInsightsStore;
};

export class DefaultTechInsightsBuilder {
  private readonly options: TechInsightsOptions;

  constructor(options: TechInsightsOptions) {
    this.options = options;
  }

  async build(): Promise<TechInsightsContext<TechInsightJsonRuleCheck>> {
    const { factRetrievers, checks, config, discovery, database } =
      this.options;

    const factRetrieverRegistry = new FactRetrieverRegistry(factRetrievers);

    const repository = await TechInsightsDatabase.create(
      await database.getClient(),
    );

    const factRetrieverEngine = await FactRetrieverEngine.create(
      repository,
      factRetrieverRegistry,
      {
        config,
        discovery,
      },
    );

    const factChecker = new JsonRulesEngineFactChecker(
      factRetrieverRegistry.getSchemas(),
      checks,
      repository,
    );

    factRetrieverEngine.schedule();

    return {
      repository,
      factChecker,
      factRetrieverEngine, // Not possibly needed to be exposed. Leaving for now since we can stop/start/reschedule fetch events manually with this
    };
  }
}
