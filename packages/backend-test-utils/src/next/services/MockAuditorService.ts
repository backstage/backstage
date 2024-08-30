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

import type {
  AuditorEvent,
  AuditorEventOptions,
} from '@backstage/backend-defaults/auditor';
import type {
  AuditorCreateEvent,
  AuditorService,
  AuthService,
  BackstageCredentials,
  HttpAuthService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { ForwardedError, ServiceUnavailableError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type { Request } from 'express';
import type { mockServices } from './mockServices';

export class MockAuditorService implements AuditorService {
  readonly #options: mockServices.auditor.Options;

  static create(options?: mockServices.auditor.Options): MockAuditorService {
    return new MockAuditorService(options ?? {});
  }

  private async log<TMeta extends JsonObject>(
    options: AuditorEventOptions<TMeta>,
  ): Promise<void> {
    const auditEvent = await this.reshapeAuditorEvent(options);
    this.#log(...auditEvent);
  }

  async createEvent<TMeta extends JsonObject>(
    options: Parameters<AuditorCreateEvent<TMeta>>[0],
  ): ReturnType<AuditorCreateEvent<TMeta>> {
    if (!options.suppressInitialEvent) {
      await this.log({ ...options, status: 'initiated' });
    }

    return {
      success: async params => {
        await this.log({
          ...options,
          meta: { ...options.meta, ...params?.meta },
          status: 'succeeded',
        });
      },
      fail: async params => {
        await this.log({
          ...options,
          ...params,
          meta: { ...options.meta, ...params.meta },
          status: 'failed',
        });
      },
    };
  }

  child(
    meta: JsonObject,
    deps?: {
      auth?: AuthService;
      httpAuth?: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ): AuditorService {
    return new MockAuditorService({
      ...this.#options,
      auth: deps?.auth ?? this.#options.auth,
      httpAuth: deps?.httpAuth ?? this.#options.httpAuth,
      plugin: deps?.plugin ?? this.#options.plugin,
      meta: {
        ...this.#options.meta,
        ...meta,
      },
    });
  }

  private async getActorId(
    request?: Request<any, any, any, any, any>,
  ): Promise<string | undefined> {
    if (!this.#options.auth) {
      throw new ServiceUnavailableError(
        `The core service 'auth' was not provided during the auditor's instantiation`,
      );
    }

    if (!this.#options.httpAuth) {
      throw new ServiceUnavailableError(
        `The core service 'httpAuth' was not provided during the auditor's instantiation`,
      );
    }

    let credentials: BackstageCredentials =
      await this.#options.auth.getOwnServiceCredentials();

    if (request) {
      try {
        credentials = await this.#options.httpAuth.credentials(request);
      } catch (error) {
        throw new ForwardedError('Could not resolve credentials', error);
      }
    }

    if (this.#options.auth.isPrincipal(credentials, 'user')) {
      return credentials.principal.userEntityRef;
    }

    if (this.#options.auth.isPrincipal(credentials, 'service')) {
      return credentials.principal.subject;
    }

    return undefined;
  }

  private async reshapeAuditorEvent<T extends JsonObject>(
    options: AuditorEventOptions<T>,
  ): Promise<AuditorEvent> {
    const { eventId, severityLevel = 'low', request, ...rest } = options;

    if (!this.#options.plugin) {
      throw new ServiceUnavailableError(
        `The core service 'plugin' was not provided during the auditor's instantiation`,
      );
    }

    const auditEvent: AuditorEvent = [
      `${this.#options.plugin.getId()}.${eventId}`,
      {
        severityLevel,
        actor: {
          actorId: await this.getActorId(request),
          ip: request?.ip,
          hostname: request?.hostname,
          userAgent: request?.get('user-agent'),
        },
        request: request
          ? {
              url: request?.originalUrl,
              method: request?.method,
            }
          : undefined,
        ...rest,
      },
    ];

    return auditEvent;
  }

  private constructor(options: mockServices.auditor.Options) {
    this.#options = options;
  }

  #log(message: string, meta?: AuditorEvent[1]) {
    console.log(message, JSON.stringify(meta));
  }
}
