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

export const permissionsFactory = createServiceFactory({
  service: permissionsServiceRef,
  deps: {
    configFactory: configServiceRef,
    discoveryFactory: discoveryServiceRef,
    tokenManagerFactory: tokenManagerServiceRef,
  },
  factory: async ({ configFactory, discoveryFactory, tokenManagerFactory }) => {
    const config = await configFactory('root');
    const discovery = await discoveryFactory('root');
    const tokenManager = await tokenManagerFactory('root');
    const permissions = ServerPermissionClient.fromConfig(config, {
      discovery,
      tokenManager,
    });
    return async (_pluginId: string) => {
      return permissions;
    };
  },
});
