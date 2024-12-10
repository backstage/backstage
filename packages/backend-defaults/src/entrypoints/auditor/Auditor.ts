/*
 * Copyright 2024 The Backstage Authors
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
  AuditorCreateEvent,
  AuditorEventSeverityLevel,
  AuditorService,
  AuthService,
  BackstageCredentials,
  HttpAuthService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type { Request } from 'express';
import type { Format } from 'logform';
import * as winston from 'winston';
import { colorFormat } from '../../lib/colorFormat';
import { defaultConsoleTransport } from '../../lib/defaultConsoleTransport';

/** @public */
export type AuditorEventActorDetails = {
  actorId?: string;
  ip?: string;
  hostname?: string;
  userAgent?: string;
};

/** @public */
export type AuditorEventRequest = {
  url: string;
  method: string;
};

/** @public */
export type AuditorEventStatus<TError extends Error = Error> =
  | { status: 'initiated' }
  | { status: 'succeeded' }
  | ({
      status: 'failed';
    } & ({ error: TError } | { errors: TError[] }));

/**
 * Options for creating an auditor event.
 *
 * @public
 */
export type AuditorEventOptions<TMeta extends JsonObject> = {
  /**
   * Use kebab-case to name audit events (e.g., "user-login", "file-download").
   *
   * The `pluginId` already provides plugin/module context, so avoid redundant prefixes in the `eventId`.
   */
  eventId: string;

  severityLevel?: AuditorEventSeverityLevel;

  /** (Optional) The associated HTTP request, if applicable. */
  request?: Request<any, any, any, any, any>;

  /** (Optional) Additional metadata relevant to the event, structured as a JSON object. */
  meta?: TMeta;
} & AuditorEventStatus;

/**
 * Common fields of an audit event.
 *
 * @public
 */
export type AuditorEvent = [
  eventId: string,
  meta: {
    severityLevel: AuditorEventSeverityLevel;
    actor: AuditorEventActorDetails;
    meta?: JsonObject;
    request?: AuditorEventRequest;
  } & AuditorEventStatus,
];

/** @public */
export const defaultProdFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

/**
 * Adds `isAuditorEvent` field
 *
 * @public
 */
export const auditorFieldFormat = winston.format(info => {
  return { ...info, isAuditorEvent: true };
})();

/** @public */
export interface RootAuditorOptions {
  meta?: JsonObject;
  format?: Format;
  transports?: winston.transport[];
}

/**
 * A {@link @backstage/backend-plugin-api#AuditorService} implementation based on winston.
 *
 * @public
 */
export class DefaultAuditorService implements AuditorService {
  private readonly impl: DefaultRootAuditorService;
  private readonly auth: AuthService;
  private readonly httpAuth: HttpAuthService;
  private readonly plugin: PluginMetadataService;

  private constructor(
    impl: DefaultRootAuditorService,
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

  /**
   * Creates a {@link DefaultAuditorService} instance.
   */
  static create(
    impl: DefaultRootAuditorService,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ): DefaultAuditorService {
    return new DefaultAuditorService(impl, deps);
  }

  private async log<TMeta extends JsonObject>(
    options: AuditorEventOptions<TMeta>,
  ): Promise<void> {
    const auditEvent = await this.reshapeAuditorEvent(options);
    this.impl.log(auditEvent);
  }

  async createEvent<TMeta extends JsonObject>(
    options: Parameters<AuditorCreateEvent<TMeta>>[0],
  ): ReturnType<AuditorCreateEvent<TMeta>> {
    if (!options.suppressInitialEvent) {
      await this.log({ ...options, status: 'initiated' });
    }

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

/** @public */
export class DefaultRootAuditorService {
  private readonly impl: winston.Logger;

  private constructor(impl: winston.Logger) {
    this.impl = impl;
  }

  /**
   * Creates a {@link DefaultRootAuditorService} instance.
   */
  static create(options?: RootAuditorOptions): DefaultRootAuditorService {
    const defaultFormatter =
      process.env.NODE_ENV === 'production'
        ? defaultProdFormat
        : DefaultRootAuditorService.colorFormat();

    let auditor = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        auditorFieldFormat,
        options?.format ?? defaultFormatter,
      ),
      transports: options?.transports ?? defaultConsoleTransport,
    });

    if (options?.meta) {
      auditor = auditor.child(options.meta);
    }
    return new DefaultRootAuditorService(auditor);
  }

  /**
   * Creates a pretty printed winston log formatter.
   */
  static colorFormat(): Format {
    return colorFormat();
  }

  async log(auditEvent: AuditorEvent): Promise<void> {
    this.impl.info(...auditEvent);
  }

  forPlugin(deps: {
    auth: AuthService;
    httpAuth: HttpAuthService;
    plugin: PluginMetadataService;
  }): AuditorService {
    const impl = new DefaultRootAuditorService(this.impl.child({}));
    return DefaultAuditorService.create(impl, deps);
  }
}
