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
  configServiceRef,
  createServiceFactory,
  discoveryServiceRef,
  permissionsServiceRef,
  tokenManagerServiceRef,
} from '@backstage/backend-plugin-api';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';

/** @public */
export const permissionsFactory = createServiceFactory({
  service: permissionsServiceRef,
  deps: {
    config: configServiceRef,
    discovery: discoveryServiceRef,
    tokenManager: tokenManagerServiceRef,
  },
  async factory({ config }) {
    return async ({ discovery, tokenManager }) => {
      return ServerPermissionClient.fromConfig(config, {
        discovery,
        tokenManager,
      });
    };
  },
});
