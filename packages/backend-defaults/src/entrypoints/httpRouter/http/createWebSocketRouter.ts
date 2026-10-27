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
  AuthService,
  HttpRouterService,
  HttpRouterServiceWebSocketHandler,
  LifecycleService,
  RootConfigService,
  RootHttpRouterService,
} from '@backstage/backend-plugin-api';
import { authenticateWebSocket } from './authenticateWebSocket';
import { createLifecycleGate } from './createLifecycleMiddleware';

/**
 * Creates plugin-relative WebSocket registration with authentication and lifecycle checks.
 * Use this when implementing a custom HTTP router service.
 *
 * @public
 */
export function createWebSocketRouter(options: {
  auth: AuthService;
  config: RootConfigService;
  lifecycle: LifecycleService;
  pluginId: string;
  rootHttpRouter: RootHttpRouterService;
}): HttpRouterService['addWebSocketHandler'] {
  const { auth, config, lifecycle, pluginId, rootHttpRouter } = options;
  const lifecycleGate = createLifecycleGate({ config, lifecycle });
  return ({
    path,
    handler,
    authPolicy,
  }: HttpRouterServiceWebSocketHandler): void => {
    if (!path.startsWith('/')) {
      throw new Error('WebSocket path must start with /');
    }
    rootHttpRouter.addWebSocketHandler({
      path: `/api/${pluginId}${path === '/' ? '' : path}`,
      async handler({ request, socket, head }) {
        let context;
        try {
          await lifecycleGate.check();
          if (socket.destroyed) {
            return;
          }
          context = await authenticateWebSocket({
            auth,
            config,
            request,
            authPolicy: authPolicy ?? 'authenticated',
          });
          await lifecycleGate.check();
        } catch (error) {
          let status = '401 Unauthorized';
          if (error.name === 'ServiceUnavailableError') {
            status = '503 Service Unavailable';
          } else if (error.name === 'NotAllowedError') {
            status = '403 Forbidden';
          }
          socket.end(
            `HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
            () => socket.destroy(),
          );
          return;
        }
        if (!socket.destroyed) {
          await handler({ request, socket, head, ...context });
        }
      },
    });
  };
}
