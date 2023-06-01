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

import { EventsServerConfig } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Server } from 'socket.io';
import { EventsServer } from './EventsServer';
import { ExtendedHttpServer } from '@backstage/backend-app-api';
import { CorsOptions } from 'cors';

/**
 * Adds events support on top of the Node.js HTTP server
 *
 * @public
 */
export function createEventsServer(
  server: ExtendedHttpServer,
  deps: { logger: LoggerService },
  options?: EventsServerConfig,
  cors?: CorsOptions,
) {
  if (!options?.enabled) {
    return;
  }

  const wss = new Server(server, { path: '/events', cors });
  EventsServer.create(wss, deps.logger.child({ type: 'events-server' }));
}
