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

import { FactRetrieverEngine } from './fact/FactRetrieverEngine';
import { Logger } from 'winston';
import { FactRetrieverRegistry } from './fact/FactRetrieverRegistry';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import {
  FactChecker,
  FactCheckerFactory,
  FactRetrieverRegistration,
  TechInsightCheck,
} from '@backstage/plugin-tech-insights-node';
import {
  DatabaseManager,
  PersistenceContext,
} from './persistence/DatabaseManager';
import { CheckResult } from '@backstage/plugin-tech-insights-common';

/**
 * @public
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 *
 * Configuration options to initialize TechInsightsBuilder. Generic types params are needed if FactCheckerFactory
 * is included for FactChecker creation.
 */
export interface TechInsightsOptions<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  /**
   * A collection of FactRetrieverRegistrations.
   * Used to register FactRetrievers and their schemas and schedule an execution loop for them.
   */
  factRetrievers: FactRetrieverRegistration[];

  /**
   * Optional factory exposing a `construct` method to initialize a FactChecker implementation
   */
  factCheckerFactory?: FactCheckerFactory<CheckType, CheckResultType>;

  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
}

/**
 * @public
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 *
 * A container for exported implementations related to TechInsights.
 * FactChecker is present if an optional FactCheckerFactory is included in the build stage.
 */
export type TechInsightsContext<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> = {
  factChecker?: FactChecker<CheckType, CheckResultType>;
  persistenceContext: PersistenceContext;
};

/**
 * @public
 *
 * Constructs needed persistence context, fact retriever engine
 * and optionally fact checker implementations to be used in the tech insights module.
 *
 * @param options - Needed options to construct TechInsightsContext
 * @returns TechInsightsContext with persistence implementations and optionally an implementation of a FactChecker
 */
export const buildTechInsightsContext = async <
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
>(
  options: TechInsightsOptions<CheckType, CheckResultType>,
): Promise<TechInsightsContext<CheckType, CheckResultType>> => {
  const {
    factRetrievers,
    factCheckerFactory,
    config,
    discovery,
    database,
    logger,
  } = options;

  const factRetrieverRegistry = new FactRetrieverRegistry(factRetrievers);

  const persistenceContext = await DatabaseManager.initializePersistenceContext(
    await database.getClient(),
    { logger },
  );

  const factRetrieverEngine = await FactRetrieverEngine.create({
    repository: persistenceContext.techInsightsStore,
    factRetrieverRegistry,
    factRetrieverContext: {
      config,
      discovery,
      logger,
    },
  });

  factRetrieverEngine.schedule();

  if (factCheckerFactory) {
    const factChecker = factCheckerFactory.construct(
      persistenceContext.techInsightsStore,
    );
    return {
      persistenceContext,
      factChecker,
    };
  }

  return {
    persistenceContext,
  };
};
