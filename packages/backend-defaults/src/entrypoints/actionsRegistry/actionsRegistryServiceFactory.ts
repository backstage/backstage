/*
 * Copyright 2025 The Backstage Authors
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
  ActionsRegistryActionOptions,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { PluginActionsRegistry } from './PluginActionsRegistry';
import { z, ZodType } from 'zod';

export const actionsRegistryServiceFactory = createServiceFactory({
  service: coreServices.actionsRegistry,
  deps: {
    metadata: coreServices.pluginMetadata,
    httpRouter: coreServices.httpRouter,
    httpAuth: coreServices.httpAuth,
    logger: coreServices.logger,
  },
  factory: ({ metadata, httpRouter, httpAuth, logger }) => {
    const pluginActionsRegistry = PluginActionsRegistry.create({
      httpAuth,
      logger,
    });

    httpRouter.use(pluginActionsRegistry.getRouter());

    return {
      async register<
        TInputSchema extends ZodType,
        TOutputSchema extends ZodType,
      >(options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>) {
        pluginActionsRegistry.register({
          ...options,
          id: `${metadata.getId()}:${options.name}`,
          schema: {
            input: options.schema?.input?.(z),
            output: options.schema?.output?.(z),
          },
        });
      },
    };
  },
});
