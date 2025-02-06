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
} from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type { Request } from 'express';

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
export type AuditorEvent = {
  plugin: string;
  eventId: string;
  severityLevel: AuditorServiceEventSeverityLevel;
  actor: AuditorEventActorDetails;
  meta?: JsonObject;
  request?: AuditorEventRequest;
} & AuditorEventStatus;

/**
 * Logging function used by the auditor.
 * @public
 */
export type AuditorLogFunction = (event: AuditorEvent) => void | Promise<void>;

/**
 * A {@link @backstage/backend-plugin-api#AuditorService} implementation that logs events using a provided callback.
 *
 * @public
 *
 * @example
 * ```ts
 * export const auditorServiceFactory = createServiceFactory({
 *   service: coreServices.auditor,
 *   deps: {
 *     logger: coreServices.logger,
 *     auth: coreServices.auth,
 *     httpAuth: coreServices.httpAuth,
 *     plugin: coreServices.pluginMetadata,
 *   },
 *   factory({ logger, plugin, auth, httpAuth }) {
 *     const auditLogger = logger.child({ isAuditEvent: true });
 *     return DefaultAuditorService.create(
 *       event => auditLogger.info(`${event.plugin}.${event.eventId}`, event),
 *       { plugin, auth, httpAuth },
 *     );
 *   },
 * });
 * ```
 */
export class DefaultAuditorService implements AuditorService {
  private readonly logFn: AuditorLogFunction;
  private readonly auth: AuthService;
  private readonly httpAuth: HttpAuthService;
  private readonly plugin: PluginMetadataService;

  private constructor(
    logFn: AuditorLogFunction,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ) {
    this.logFn = logFn;
    this.auth = deps.auth;
    this.httpAuth = deps.httpAuth;
    this.plugin = deps.plugin;
  }

  /**
   * Creates a {@link DefaultAuditorService} instance.
   */
  static create(
    logFn: AuditorLogFunction,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ): DefaultAuditorService {
    return new DefaultAuditorService(logFn, deps);
  }

  private async log<TMeta extends JsonObject>(
    options: AuditorEventOptions<TMeta>,
  ): Promise<void> {
    const { eventId, severityLevel = 'low', request, meta, ...rest } = options;

    await this.logFn({
      plugin: this.plugin.getId(),
      eventId,
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
    });
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
          error: String(params.error),
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
}
