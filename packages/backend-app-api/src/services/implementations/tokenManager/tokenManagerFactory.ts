/*
 * Copyright 2022 The Backstage Authors
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
} from '@backstage/backend-plugin-api';
import { ServerTokenManager } from '@backstage/backend-common';

/** @public */
export const tokenManagerFactory = createServiceFactory({
  service: coreServices.tokenManager,
  deps: {
    config: coreServices.config,
    logger: coreServices.rootLogger,
  },
  createRootContext({ config, logger }) {
    return ServerTokenManager.fromConfig(config, {
      logger,
    });
  },
  async factory(_deps, tokenManager) {
    return tokenManager;
  },
});
