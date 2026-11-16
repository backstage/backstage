/*
 * Copyright 2026 The Backstage Authors
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
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { aiModelsServiceRef } from '@backstage/backend-plugin-api/alpha';
import { builtinProviderFactories } from './builtinProviderFactories';
import { DefaultAIModelsService } from './DefaultAIModelsService';
import type { AIProviderFactory } from './types';

/**
 * A multiton reference for contributing additional AI provider families to
 * the default AI models service.
 *
 * @example
 * ```ts
 * backend.add(
 *   createServiceFactory({
 *     service: aiProviderFactoriesServiceRef,
 *     deps: {},
 *     async factory() {
 *       return myProviderFactory;
 *     },
 *   }),
 * );
 * ```
 *
 * @alpha
 */
export const aiProviderFactoriesServiceRef =
  createServiceRef<AIProviderFactory>({
    id: 'core.ai.providerFactories',
    scope: 'plugin',
    multiton: true,
  });

/**
 * Provides access to the AI models configured under `ai.providers`.
 *
 * See {@link https://backstage.io/docs/backend-system/core-services/ai-models | the service docs}
 * for more information.
 *
 * @alpha
 */
export const aiModelsServiceFactory = createServiceFactory({
  service: aiModelsServiceRef,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
    lifecycle: coreServices.lifecycle,
    factories: aiProviderFactoriesServiceRef,
  },
  async factory({ config, logger, lifecycle, factories }) {
    const service = await DefaultAIModelsService.create({
      config,
      logger,
      factories: [...builtinProviderFactories, ...factories],
    });
    lifecycle.addShutdownHook(() => service.dispose());
    return service;
  },
});
