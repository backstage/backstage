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

import type {
  AuthService,
  HttpRouterServiceWebSocketContext,
  HttpRouterServiceWebSocketHandler,
  RootConfigService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { AuthenticationError, toError } from '@backstage/errors';
import type { IncomingMessage } from 'node:http';

export async function authenticateWebSocket(options: {
  auth: AuthService;
  logger?: LoggerService;
  config: RootConfigService;
  request: IncomingMessage;
  authPolicy:
    | NonNullable<HttpRouterServiceWebSocketHandler['authPolicy']>
    | 'authenticated';
}): Promise<
  Pick<HttpRouterServiceWebSocketContext, 'credentials' | 'authProtocol'>
> {
  const { auth, config, request, authPolicy, logger } = options;
  if (authPolicy === 'unauthenticated') {
    return { credentials: await auth.getNoneCredentials() };
  }
  const bearer =
    request.headers.authorization?.match(/^Bearer[ ]+(\S+)$/i)?.[1];
  const protocols =
    request.headers['sec-websocket-protocol']
      ?.split(',')
      .map(value => value.trim())
      .filter(Boolean) ?? [];
  const candidates = bearer ? [...protocols, bearer] : protocols;
  if (candidates.length > 5) {
    throw new AuthenticationError(
      'WebSocket authentication accepts at most 5 candidates',
    );
  }
  let deniedError: Error | undefined;
  let authenticationError: Error | undefined;
  for (const [index, token] of candidates.entries()) {
    try {
      const credentials = await auth.authenticate(token);
      if (
        auth.isPrincipal(credentials, 'user') ||
        auth.isPrincipal(credentials, 'service')
      ) {
        return {
          credentials,
          authProtocol: protocols.includes(token) ? token : undefined,
        };
      }
      logger?.debug(
        'WebSocket authentication candidate has no supported principal',
        {
          source: index < protocols.length ? 'protocol' : 'authorization',
          candidateIndex: index,
        },
      );
    } catch (err) {
      const error = toError(err);
      logger?.debug('WebSocket authentication candidate failed', {
        source: index < protocols.length ? 'protocol' : 'authorization',
        candidateIndex: index,
        errorType: error.name,
      });
      if (error.name === 'NotAllowedError') {
        deniedError = error;
      } else if (error.name === 'AuthenticationError') {
        authenticationError ??= error;
      }
    }
  }
  if (
    authPolicy === 'authenticated' &&
    config.getOptionalBoolean(
      'backend.auth.dangerouslyDisableDefaultAuthPolicy',
    )
  ) {
    return { credentials: await auth.getNoneCredentials() };
  }
  throw (
    deniedError ??
    authenticationError ??
    new AuthenticationError('Missing or invalid WebSocket credentials')
  );
}
