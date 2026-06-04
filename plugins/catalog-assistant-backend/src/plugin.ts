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

import { createAnthropic } from '@ai-sdk/anthropic';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { generateText } from 'ai';
import { CatalogContextRetriever } from './services/CatalogContextRetriever';
import { QueryService } from './services/QueryService';
import { createRouter } from './router/createRouter';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_CONTEXT_ENTITIES = 20;
const DEFAULT_MAX_OUTPUT_TOKENS = 1024;

/**
 * Backend plugin that answers catalog questions with an LLM grounded on
 * Backstage catalog entities.
 *
 * @public
 */
export const catalogAssistantPlugin = createBackendPlugin({
  pluginId: 'catalog-assistant',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        discovery: coreServices.discovery,
      },
      async init({ config, logger, httpRouter, httpAuth, discovery }) {
        const sub = config.getOptionalConfig('catalogAssistant');
        const apiKey =
          sub?.getOptionalString('anthropicApiKey') ??
          process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          throw new Error(
            'catalog-assistant: ANTHROPIC_API_KEY env var or ' +
              'catalogAssistant.anthropicApiKey config is required',
          );
        }

        const modelId = sub?.getOptionalString('model') ?? DEFAULT_MODEL;
        const maxContextEntities =
          sub?.getOptionalNumber('maxContextEntities') ??
          DEFAULT_MAX_CONTEXT_ENTITIES;
        const maxOutputTokens =
          sub?.getOptionalNumber('maxOutputTokens') ??
          DEFAULT_MAX_OUTPUT_TOKENS;

        const anthropic = createAnthropic({ apiKey });
        const model = anthropic(modelId);

        const catalog = new CatalogClient({ discoveryApi: discovery });
        const retriever = new CatalogContextRetriever(
          catalog,
          maxContextEntities,
        );
        const queryService = new QueryService(
          retriever,
          model,
          generateText,
          logger,
          maxOutputTokens,
        );

        httpRouter.use(createRouter({ queryService, httpAuth, logger }));
      },
    });
  },
});
