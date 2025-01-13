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
  AuditorService,
  AuditorServiceCreateEventOptions,
  AuditorServiceEvent,
  AuthService,
  BackstageCredentials,
  HttpAuthService,
  PluginMetadataService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type { Request } from 'express';
import { mockServices } from './mockServices';

export class MockAuditorService implements AuditorService {
  private readonly impl: MockRootAuditorService;
  private readonly auth: AuthService;
  private readonly httpAuth: HttpAuthService;
  private readonly plugin: PluginMetadataService;

  private constructor(
    impl: MockRootAuditorService,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ) {
    this.impl = impl;
    this.auth = deps.auth;
    this.httpAuth = deps.httpAuth;
    this.plugin = deps.plugin;
  }

  static create(
    impl: MockRootAuditorService,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ): AuditorService {
    return new MockAuditorService(impl, deps);
  }

  private async log<TMeta extends JsonObject>(
    options: AuditorEventOptions<TMeta>,
  ): Promise<void> {
    const auditEvent = await this.reshapeAuditorEvent(options);
    this.impl.log(auditEvent);
  }

  async createEvent(
    options: AuditorServiceCreateEventOptions,
  ): Promise<AuditorServiceEvent> {
    await this.log({ ...options, status: 'initiated' });

    return {
      success: async params => {
        // return undefined if both objects are empty; otherwise, merge the objects
        const meta =
          Object.keys(options.meta ?? {}).length === 0 &&
          Object.keys(params?.meta ?? {}).length === 0
            ? undefined
            : { ...options.meta, ...params?.meta };

        await this.log({
          ...options,
          meta,
          status: 'succeeded',
        });
      },
      fail: async params => {
        // return undefined if both objects are empty; otherwise, merge the objects
        const meta =
          Object.keys(options.meta ?? {}).length === 0 &&
          Object.keys(params.meta ?? {}).length === 0
            ? undefined
            : { ...options.meta, ...params.meta };

        await this.log({
          ...options,
          ...params,
          meta,
          status: 'failed',
        });
      },
    };
  }

  private async getActorId(
    request?: Request<any, any, any, any, any>,
  ): Promise<string | undefined> {
    let credentials: BackstageCredentials =
      await this.auth.getOwnServiceCredentials();

    if (request) {
      try {
        credentials = await this.httpAuth.credentials(request);
      } catch (error) {
        throw new ForwardedError('Could not resolve credentials', error);
      }
    }

    if (this.auth.isPrincipal(credentials, 'user')) {
      return credentials.principal.userEntityRef;
    }

    if (this.auth.isPrincipal(credentials, 'service')) {
      return credentials.principal.subject;
    }

    return undefined;
  }

  private async reshapeAuditorEvent<T extends JsonObject>(
    options: AuditorEventOptions<T>,
  ): Promise<AuditorEvent> {
    const { eventId, severityLevel = 'low', request, ...rest } = options;

    const auditEvent: AuditorEvent = [
      `${this.plugin.getId()}.${eventId}`,
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
}

export class MockRootAuditorService {
  private readonly impl: RootLoggerService;

  private constructor() {
    this.impl = mockServices.rootLogger();
  }

  static create(): MockRootAuditorService {
    return new MockRootAuditorService();
  }

  async log(auditorEvent: AuditorEvent): Promise<void> {
    const [eventId, meta] = auditorEvent;

    // change `error` type to a string for logging purposes
    let fields: Omit<AuditorEvent[1], 'error'> & { error?: string };

    if ('error' in meta) {
      fields = { ...meta, error: meta.error.toString() };
    } else {
      fields = meta;
    }

    this.impl.info(eventId, fields);
  }

  forPlugin(deps: {
    auth: AuthService;
    httpAuth: HttpAuthService;
    plugin: PluginMetadataService;
  }): AuditorService {
    const impl = new MockRootAuditorService();
    return MockAuditorService.create(impl, deps);
  }
}
