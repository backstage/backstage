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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { createRouter } from './service';
import { DefaultPlaylistPermissionPolicy } from './permissions';

/**
 * A permission policy module that implements the Playlist plugin sub-policy.
 * This would be applied as a "sub-policy", for Playlist permission requests only,
 * by the master permission policy if it support sub-policies.
 *
 * @alpha
 */
export const defaultPlaylistSubPermissionPolicy = createBackendModule({
  moduleId: 'defaultPlaylistSubPermissionPolicy',
  pluginId: 'permission',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.addSubPolicies(new DefaultPlaylistPermissionPolicy());
      },
    });
  },
});

/**
 * Playlist plugin
 *
 * @alpha
 */
export const playlistPlugin = createBackendPlugin(() => ({
  pluginId: 'playlist',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        database: coreServices.database,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        identity: coreServices.identity,
        permissions: coreServices.permissions,
      },
      async init({ http, database, logger, discovery, identity, permissions }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        http.use(
          await createRouter({
            database: database,
            discovery: discovery,
            identity: identity,
            logger: winstonLogger,
            permissions: permissions,
          }),
        );
      },
    });
  },
}));
