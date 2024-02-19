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

import {
  DefaultFactRetrieverEngine,
  FactRetrieverEngine,
} from './fact/FactRetrieverEngine';
import { Logger } from 'winston';
import { DefaultFactRetrieverRegistry } from './fact/FactRetrieverRegistry';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import {
  FactChecker,
  FactCheckerFactory,
  FactRetrieverRegistration,
  FactRetrieverRegistry,
  PersistenceContext,
  TechInsightCheck,
} from '@backstage/plugin-tech-insights-node';
import { initializePersistenceContext } from './persistence';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

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
   * Optional collection of FactRetrieverRegistrations (required if no factRetrieverRegistry passed in).
   * Used to register FactRetrievers and their schemas and schedule an execution loop for them.
   *
   * Not needed if passing in your own FactRetrieverRegistry implementation. Required otherwise.
   */
  factRetrievers?: FactRetrieverRegistration[];

  /**
   * Optional factory exposing a `construct` method to initialize a FactChecker implementation
   */
  factCheckerFactory?: FactCheckerFactory<CheckType, CheckResultType>;

  /**
   * Optional FactRetrieverRegistry implementation that replaces the default one.
   *
   * If passing this in you don't need to pass in factRetrievers also.
   */
  factRetrieverRegistry?: FactRetrieverRegistry;

  /**
   * Optional persistenceContext implementation that replaces the default one.
   * This can be used to replace underlying database with a more suitable implementation if needed
   */
  persistenceContext?: PersistenceContext;

  logger: Logger;
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
  scheduler: PluginTaskScheduler;
  tokenManager: TokenManager;
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
  factRetrieverEngine: FactRetrieverEngine;
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
    scheduler,
    tokenManager,
  } = options;

  const buildFactRetrieverRegistry = (): FactRetrieverRegistry => {
    if (!options.factRetrieverRegistry) {
      if (!factRetrievers) {
        throw new Error(
          'Failed to build FactRetrieverRegistry because no factRetrievers found',
        );
      }
      return new DefaultFactRetrieverRegistry(factRetrievers);
    }
    return options.factRetrieverRegistry;
  };

  const factRetrieverRegistry = buildFactRetrieverRegistry();

  const persistenceContext =
    options.persistenceContext ??
    (await initializePersistenceContext(database, {
      logger,
    }));

  const factRetrieverEngine = await DefaultFactRetrieverEngine.create({
    scheduler,
    repository: persistenceContext.techInsightsStore,
    factRetrieverRegistry,
    factRetrieverContext: {
      config,
      discovery,
      logger,
      tokenManager,
    },
  });

  await factRetrieverEngine.schedule();

  if (factCheckerFactory) {
    const factChecker = factCheckerFactory.construct(
      persistenceContext.techInsightsStore,
    );
    return {
      persistenceContext,
      factChecker,
      factRetrieverEngine,
    };
  }

  return {
    persistenceContext,
    factRetrieverEngine,
  };
};
