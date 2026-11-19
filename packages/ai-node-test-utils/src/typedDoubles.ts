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
  BackstageCredentials,
  BackstagePrincipalTypes,
  LifecycleService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  PermissionCondition,
  PermissionCriteria,
  QueryPermissionRequest,
  QueryPermissionResponse,
} from '@backstage/plugin-permission-common';

/**
 * Builds a genuine JSON `Response` — a real `Response` object, so consumers
 * exercise the real parsing path rather than a partial double.
 *
 * @alpha
 */
export function createJsonResponse(
  status: number,
  body: unknown,
  headers: Readonly<Record<string, string>> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

/**
 * Builds a genuine SSE `Response`: a real stream carrying the given event
 * chunks, already encoded.
 *
 * @alpha
 */
export function createSseResponse(
  status: number,
  events: readonly string[],
  headers: Readonly<Record<string, string>> = {},
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(event));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    status,
    headers: { 'content-type': 'text/event-stream', ...headers },
  });
}

/**
 * Wraps a test transport handler so it genuinely satisfies `typeof fetch`:
 * the handler receives the request as a `Request`, and the wrapper speaks
 * the full `fetch` signature — no `as unknown as` casts at the seams.
 *
 * @alpha
 */
export function testTransport(
  handle: (
    request: Request,
    init?: RequestInit,
  ) => Response | Promise<Response>,
): typeof fetch {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init);
    return handle(request, init);
  };
}

/**
 * A transport that always answers one JSON response.
 *
 * @alpha
 */
export function jsonTransport(
  status: number,
  body: unknown,
  headers?: Readonly<Record<string, string>>,
): typeof fetch {
  return testTransport(async () => createJsonResponse(status, body, headers));
}

/**
 * A genuine flat-ALLOW decision for `authorize`.
 *
 * @alpha
 */
export const allowDecision: AuthorizePermissionResponse = Object.freeze({
  result: 'ALLOW',
});

/**
 * A genuine flat-DENY decision for `authorize`.
 *
 * @alpha
 */
export const denyDecision: AuthorizePermissionResponse = Object.freeze({
  result: 'DENY',
});

/**
 * Builds a genuine conditional `authorizeConditional` response — the
 * envelope shape the permission integration consumes: `pluginId` and
 * `resourceType` as siblings of `result`, `conditions` alongside them.
 *
 * @alpha
 */
export function conditionalDecision(input: {
  pluginId: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
}): QueryPermissionResponse {
  return {
    result: 'CONDITIONAL',
    pluginId: input.pluginId,
    resourceType: input.resourceType,
    conditions: input.conditions,
  };
}

/**
 * A `PermissionsService` double that genuinely satisfies the real
 * interface. Both methods default to flat ALLOW; pass `authorize` or
 * `query` hooks to control the answers, including genuine conditional
 * envelopes built with {@link conditionalDecision}.
 *
 * @alpha
 */
export function createPermissionsServiceDouble(
  options: {
    authorize?: (
      request: AuthorizePermissionRequest,
      credentials: BackstageCredentials,
    ) => AuthorizePermissionResponse | Promise<AuthorizePermissionResponse>;
    query?: (
      request: QueryPermissionRequest,
      credentials: BackstageCredentials | undefined,
    ) => QueryPermissionResponse | Promise<QueryPermissionResponse>;
  } = {},
): PermissionsService {
  return {
    authorize: async (requests, serviceOptions) =>
      Promise.all(
        requests.map(request =>
          options.authorize
            ? options.authorize(request, serviceOptions.credentials)
            : allowDecision,
        ),
      ),
    authorizeConditional: async (requests, serviceOptions) =>
      Promise.all(
        requests.map(request =>
          options.query
            ? options.query(request, serviceOptions.credentials)
            : allowDecision,
        ),
      ),
  };
}

/**
 * An `AuthService` double that genuinely satisfies the real interface. The
 * principal check inspects the credentials' own principal type, exactly as
 * the real service narrows it; token issuance returns fixed test values.
 *
 * @alpha
 */
export function createAuthServiceDouble(): AuthService {
  return {
    authenticate: async () => {
      throw new Error('authenticate is not used in this test');
    },
    isPrincipal: <TType extends keyof BackstagePrincipalTypes>(
      credentials: BackstageCredentials,
      type: TType,
    ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]> =>
      (credentials.principal as { type: string }).type === type,
    getNoneCredentials: async () => ({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'none' },
    }),
    getOwnServiceCredentials: async () => ({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'service', subject: 'test-plugin' },
    }),
    getPluginRequestToken: async () => ({ token: 'test-plugin-token' }),
    getLimitedUserToken: async () => ({
      token: 'test-limited-token',
      expiresAt: new Date(),
    }),
    listPublicServiceKeys: async () => ({ keys: [] }),
  };
}

/**
 * A `LifecycleService` double that genuinely satisfies the real interface
 * and records shutdown hooks so tests can trigger them.
 *
 * @alpha
 */
export function createLifecycleServiceDouble(): LifecycleService & {
  shutdownHooks: Array<() => void | Promise<void>>;
  startupHooks: Array<() => void | Promise<void>>;
} {
  const shutdownHooks: Array<() => void | Promise<void>> = [];
  const startupHooks: Array<() => void | Promise<void>> = [];
  return {
    shutdownHooks,
    startupHooks,
    addStartupHook: hook => {
      startupHooks.push(hook);
    },
    addShutdownHook: hook => {
      shutdownHooks.push(hook);
    },
  };
}
