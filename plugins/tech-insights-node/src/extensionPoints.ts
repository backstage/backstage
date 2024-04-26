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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { FactCheckerFactory, TechInsightCheck } from './checks';
import { FactRetriever, FactRetrieverRegistry } from './facts';
import { PersistenceContext } from './persistence';

/**
 * @public
 */
export interface TechInsightsFactRetrieversExtensionPoint {
  addFactRetrievers(factRetrievers: Record<string, FactRetriever>): void;
}

/**
 * An extension point that allows other plugins or modules to add fact retrievers.
 *
 * @public
 */
export const techInsightsFactRetrieversExtensionPoint =
  createExtensionPoint<TechInsightsFactRetrieversExtensionPoint>({
    id: 'tech-insights.fact-retrievers',
  });

/**
 * @public
 */
export interface TechInsightsFactCheckerFactoryExtensionPoint {
  setFactCheckerFactory<
    CheckType extends TechInsightCheck,
    CheckResultType extends CheckResult,
  >(
    factory: FactCheckerFactory<CheckType, CheckResultType>,
  ): void;
}

/**
 * An extension point that allows other plugins or modules to set a FactCheckerFactory.
 *
 * @public
 */
export const techInsightsFactCheckerFactoryExtensionPoint =
  createExtensionPoint<TechInsightsFactCheckerFactoryExtensionPoint>({
    id: 'tech-insights.fact-checker-factory',
  });

/**
 * @public
 */
export interface TechInsightsFactRetrieverRegistryExtensionPoint {
  setFactRetrieverRegistry(registry: FactRetrieverRegistry): void;
}

/**
 * An extension point that allows other plugins or modules to set a custom FactRetrieverRegistry.
 *
 * @public
 */
export const techInsightsFactRetrieverRegistryExtensionPoint =
  createExtensionPoint<TechInsightsFactRetrieverRegistryExtensionPoint>({
    id: 'tech-insights.fact-retriever-registry',
  });

/**
 * @public
 */
export interface TechInsightsPersistenceContextExtensionPoint {
  setPersistenceContext(context: PersistenceContext): void;
}

/**
 * An extension point that allows other plugins or modules to set a custom PersistenceContext.
 *
 * @public
 */
export const techInsightsPersistenceContextExtensionPoint =
  createExtensionPoint<TechInsightsPersistenceContextExtensionPoint>({
    id: 'tech-insights.persistence-context',
  });
