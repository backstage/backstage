/*
 * Copyright 2023 The Backstage Authors
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

import { SignalsClientManager } from '@backstage/backend-common';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

/** @public */
export const signalsServiceFactory = createServiceFactory({
  service: coreServices.signals,
  deps: {
    config: coreServices.config,
    plugin: coreServices.pluginMetadata,
    tokenManager: coreServices.tokenManager,
  },
  async createRootContext({ config }) {
    // TokenManager not available in root so set it in the factory
    return SignalsClientManager.fromConfig(config);
  },
  async factory({ plugin, tokenManager }, manager) {
    return manager
      .setTokenManager(tokenManager)
      .forPlugin(plugin.getId())
      .getClient();
  },
});
