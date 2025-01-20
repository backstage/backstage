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
  AuditorService,
  AuditorServiceCreateEventOptions,
  AuditorServiceEvent,
  AuditorServiceEventSeverityLevel,
  AuthService,
  BackstageCredentials,
  HttpAuthService,
  PluginMetadataService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type { Request } from 'express';
import type { Format } from 'logform';
import * as winston from 'winston';
import { WinstonLogger } from '../rootLogger';

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
export type AuditorEventStatus =
  | { status: 'initiated' }
  | { status: 'succeeded' }
  | {
      status: 'failed';
      error: string;
    };

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

  severityLevel?: AuditorServiceEventSeverityLevel;

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
    plugin: string;
    severityLevel: AuditorServiceEventSeverityLevel;
    actor: AuditorEventActorDetails;
    meta?: JsonObject;
    request?: AuditorEventRequest;
  } & AuditorEventStatus,
];

/** @public */
export const defaultFormatter = winston.format.combine(
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

  async createEvent(
    options: AuditorServiceCreateEventOptions,
  ): Promise<AuditorServiceEvent> {
    await this.log({ ...options, status: 'initiated' });

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
          error: params.error.toString(),
          meta: { ...options.meta, ...params?.meta },
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
    const { eventId, severityLevel = 'low', request, meta, ...rest } = options;

    const auditEvent: AuditorEvent = [
      `${this.plugin.getId()}.${eventId}`,
      {
        plugin: this.plugin.getId(),
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
        meta: Object.keys(meta ?? {}).length === 0 ? undefined : meta,
        ...rest,
      },
    ];

    return auditEvent;
  }
}

/**
 * Options for creating a root auditor.
 * If `rootLogger` is provided, the root auditor will default to using it.
 * Otherwise, a new logger will be created using the provided `meta`, `format`, and `transports`.
 *
 * @public
 */
export type RootAuditorOptions =
  | {
      meta?: JsonObject;
      format?: Format;
      transports?: winston.transport[];
    }
  | {
      rootLogger: RootLoggerService;
    };

/** @public */
export class DefaultRootAuditorService {
  private readonly impl: WinstonLogger;

  private constructor(impl: WinstonLogger) {
    this.impl = impl;
  }

  /**
   * Creates a {@link DefaultRootAuditorService} instance.
   */
  static create(options?: RootAuditorOptions): DefaultRootAuditorService {
    if (options && 'rootLogger' in options) {
      return new DefaultRootAuditorService(
        options.rootLogger.child({ isAuditorEvent: true }) as WinstonLogger,
      );
    }

    let auditor = WinstonLogger.create({
      meta: {
        service: 'backstage',
      },
      level: 'info',
      format: winston.format.combine(
        auditorFieldFormat,
        options?.format ?? defaultFormatter,
      ),
      transports: options?.transports,
    });

    if (options?.meta) {
      auditor = auditor.child(options.meta) as WinstonLogger;
    }

    return new DefaultRootAuditorService(auditor);
  }

  async log(auditorEvent: AuditorEvent): Promise<void> {
    this.impl.info(...auditorEvent);
  }

  forPlugin(deps: {
    auth: AuthService;
    httpAuth: HttpAuthService;
    plugin: PluginMetadataService;
  }): AuditorService {
    const impl = new DefaultRootAuditorService(
      this.impl.child({}) as WinstonLogger,
    );
    return DefaultAuditorService.create(impl, deps);
  }
}
