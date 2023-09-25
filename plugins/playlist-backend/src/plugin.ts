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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service';
import { loggerToWinstonLogger } from '@backstage/backend-common';

/**
 * Playlist backend plugin
 *
 * @public
 */
export const playlistPlugin = createBackendPlugin({
  pluginId: 'playlist',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
        database: coreServices.database,
        identity: coreServices.identity,
        discovery: coreServices.discovery,
        permissions: coreServices.permissions,
      },
      async init({ http, logger, database, identity, discovery, permissions }) {
        http.use(
          await createRouter({
            logger: loggerToWinstonLogger(logger),
            database,
            identity,
            discovery,
            permissions,
          }),
        );
      },
    });
  },
});
