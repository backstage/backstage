/*
 * Copyright 2024 The Backstage Authors
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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import {
  FactCheckerFactory,
  FactRetriever,
  FactRetrieverRegistration,
  FactRetrieverRegistry,
  PersistenceContext,
  TechInsightCheck,
  techInsightsFactCheckerFactoryExtensionPoint,
  techInsightsFactRetrieverRegistryExtensionPoint,
  techInsightsFactRetrieversExtensionPoint,
  techInsightsPersistenceContextExtensionPoint,
} from '@backstage/plugin-tech-insights-node';
import {
  buildTechInsightsContext,
  createRouter,
  entityMetadataFactRetriever,
  entityOwnershipFactRetriever,
  techdocsFactRetriever,
} from '../service';
import { createFactRetrieverRegistrationFromConfig } from './config';

/**
 * The tech-insights backend plugin.
 *
 * @public
 */
export const techInsightsPlugin = createBackendPlugin({
  pluginId: 'tech-insights',
  register(env) {
    let factCheckerFactory:
      | FactCheckerFactory<TechInsightCheck, CheckResult>
      | undefined = undefined;
    env.registerExtensionPoint(techInsightsFactCheckerFactoryExtensionPoint, {
      setFactCheckerFactory<
        CheckType extends TechInsightCheck,
        CheckResultType extends CheckResult,
      >(factory: FactCheckerFactory<CheckType, CheckResultType>): void {
        factCheckerFactory = factory;
      },
    });

    let factRetrieverRegistry: FactRetrieverRegistry | undefined = undefined;
    env.registerExtensionPoint(
      techInsightsFactRetrieverRegistryExtensionPoint,
      {
        setFactRetrieverRegistry(registry: FactRetrieverRegistry): void {
          factRetrieverRegistry = registry;
        },
      },
    );

    // initialized with built-in fact retrievers
    // only added as registration if there is config for them
    const addedFactRetrievers: Record<string, FactRetriever> = {
      entityMetadataFactRetriever,
      entityOwnershipFactRetriever,
      techdocsFactRetriever,
    };
    env.registerExtensionPoint(techInsightsFactRetrieversExtensionPoint, {
      addFactRetrievers(factRetrievers: Record<string, FactRetriever>): void {
        Object.entries(factRetrievers).forEach(([key, value]) => {
          addedFactRetrievers[key] = value;
        });
      },
    });

    let persistenceContext: PersistenceContext | undefined = undefined;
    env.registerExtensionPoint(techInsightsPersistenceContextExtensionPoint, {
      setPersistenceContext(context: PersistenceContext): void {
        persistenceContext = context;
      },
    });

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        database: coreServices.database,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        tokenManager: coreServices.tokenManager,
      },
      async init({
        config,
        database,
        discovery,
        httpRouter,
        logger,
        scheduler,
        tokenManager,
      }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const factRetrievers: FactRetrieverRegistration[] = Object.entries(
          addedFactRetrievers,
        )
          .map(([name, factRetriever]) =>
            createFactRetrieverRegistrationFromConfig(
              config,
              name,
              factRetriever,
            ),
          )
          .filter(registration => registration) as FactRetrieverRegistration[];

        const context = await buildTechInsightsContext({
          config,
          database,
          discovery,
          factCheckerFactory,
          factRetrieverRegistry,
          factRetrievers,
          logger: winstonLogger,
          persistenceContext,
          scheduler,
          tokenManager,
        });

        httpRouter.use(
          await createRouter({
            ...context,
            config,
            logger: winstonLogger,
          }),
        );
      },
    });
  },
});
