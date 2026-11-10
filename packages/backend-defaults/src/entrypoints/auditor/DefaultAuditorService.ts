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
  AuditSink,
  AuditorEvent,
  AuditorEventActorDetails,
  AuditorEventRequest,
  AuditorEventRequestContext,
  AuditorEventStatus,
  AuditorService,
  AuditorServiceCreateEventOptions,
  AuditorServiceEvent,
  AuditorServiceEventSeverityLevel,
  AuthService,
  BackstageCredentials,
  HttpAuthService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { ForwardedError, InputError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import {
  createAuditPipeline,
  createRedactMetaStage,
  createSanitizeRequestStage,
  createTruncateMetaStage,
  reportAuditError,
  serializeAuditError,
} from './pipeline';
import {
  DEFAULT_MAX_META_STRING_LENGTH,
  DEFAULT_REDACT_META_KEYS,
} from './utils';

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

  /** (Optional) The unique ID of the event instance. */
  id?: string;

  severityLevel?: AuditorServiceEventSeverityLevel;

  /** (Optional) The associated HTTP request or plain request context. */
  request?: Request<any, any, any, any, any> | AuditorEventRequestContext;

  /** (Optional) Explicit actor attribution, winning over the derived actor. */
  actor?: AuditorEventActorDetails;

  /** (Optional) Additional metadata relevant to the event. */
  meta?: TMeta;

  /** (Optional) Correlation ID linking related audit events together. */
  correlationId?: string;

  /** (Optional) ID of the audit event that this event was caused by. */
  parentEventId?: string;
} & AuditorEventStatus;

/** @public */
export type AuditorLogFunction = (event: AuditorEvent) => void | Promise<void>;

/** The subset of event options that an event handle holds across its lifetime. */
type AuditorEventHandleOptions = Omit<
  AuditorEventOptions<JsonObject>,
  keyof AuditorEventStatus
>;

/**
 * A stateful handle for an audit event, holding the merged metadata across the
 * event's lifetime and finalizing exactly once.
 */
class AuditorServiceEventHandle implements AuditorServiceEvent {
  readonly id: string;
  private readonly options: AuditorEventHandleOptions;
  private readonly meta: JsonObject;
  private finalized = false;

  constructor(
    private readonly emit: (
      options: AuditorEventOptions<JsonObject>,
    ) => Promise<void>,
    options: AuditorEventHandleOptions,
    id: string,
  ) {
    this.id = id;
    this.options = options;
    this.meta = { ...options.meta };
  }

  update(meta: JsonObject): void {
    if (this.finalized) {
      return;
    }
    Object.assign(this.meta, meta);
  }

  async success(options?: { meta?: JsonObject }): Promise<void> {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    Object.assign(this.meta, options?.meta ?? {});

    await this.emit({
      ...this.options,
      id: this.id,
      meta: this.meta,
      status: 'succeeded',
    });
  }

  async fail(options: { meta?: JsonObject; error: Error }): Promise<void> {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    Object.assign(this.meta, options?.meta ?? {});

    await this.emit({
      ...this.options,
      id: this.id,
      meta: this.meta,
      status: 'failed',
      error: serializeAuditError(options.error),
    });
  }

  attachToResponse(res: Response): void {
    const finalizeFromResponse = () => {
      if (!res.writableFinished) {
        void this.fail({
          error: new Error('Client disconnected before response completed'),
          meta: { responseStatus: res.statusCode },
        });
      } else if (res.statusCode >= 400) {
        void this.fail({
          error: new Error(`Request completed with status ${res.statusCode}`),
          meta: { responseStatus: res.statusCode },
        });
      } else {
        void this.success({ meta: { responseStatus: res.statusCode } });
      }
    };

    const finalizeOnce = () => {
      res.removeListener('finish', finalizeOnce);
      res.removeListener('close', finalizeOnce);
      finalizeFromResponse();
    };

    res.once('finish', finalizeOnce);
    res.once('close', finalizeOnce);
  }
}

/**
 * Options that control the default auditor service.
 */
type DefaultAuditorServiceOptions = {
  auth: AuthService;
  httpAuth: HttpAuthService;
  plugin: PluginMetadataService;
  /** Called when emitting an audit event fails; must not throw. */
  onError?: (error: Error) => void;
  /** Whether query strings are stripped from request URLs. Defaults to `true`. */
  sanitizeRequestQuery?: boolean;
  /** Maximum length of metadata strings, `-1` disables. Defaults to `4096`. */
  maxMetaStringLength?: number;
  /** Metadata keys whose values are redacted; an empty array disables redaction. */
  redactMetaKeys?: string[];
  /**
   * Optional per-severity sampling probabilities between 0 and 1. A probability
   * of `0` drops all events of that severity, except for `critical` where a
   * probability of `0` is rejected.
   */
  sampling?: Partial<Record<AuditorServiceEventSeverityLevel, number>>;
};

/**
 * A {@link @backstage/backend-plugin-api#AuditorService} implementation that
 * writes events to a provided {@link @backstage/backend-plugin-api#AuditSink}
 * through an internal pipeline that sanitizes requests and applies metadata
 * hygiene before the event is written.
 *
 * Terminal event calls (`success` / `fail`) never reject: failures to emit an
 * event are reported through the optional `onError` callback instead of
 * propagating to the caller.
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
 *       {
 *         write: async event => {
 *           auditLogger.info(`${event.plugin}.${event.eventId}`, event);
 *         },
 *       },
 *       { plugin, auth, httpAuth },
 *     );
 *   },
 * });
 * ```
 */
export class DefaultAuditorService implements AuditorService {
  private readonly auth: AuthService;
  private readonly httpAuth: HttpAuthService;
  private readonly plugin: PluginMetadataService;
  private readonly onError?: (error: Error) => void;
  private readonly sampling?: Partial<
    Record<AuditorServiceEventSeverityLevel, number>
  >;
  private readonly pipeline: { emit(event: AuditorEvent): Promise<void> };

  private constructor(sink: AuditSink, deps: DefaultAuditorServiceOptions) {
    if (deps.sampling?.critical === 0) {
      throw new InputError(
        'Critical audit events cannot be sampled away entirely; the sampling probability for the critical severity must be greater than 0.',
      );
    }
    this.auth = deps.auth;
    this.httpAuth = deps.httpAuth;
    this.plugin = deps.plugin;
    this.onError = deps.onError;
    this.sampling = deps.sampling;
    this.pipeline = createAuditPipeline({
      stages: [
        createSanitizeRequestStage(deps.sanitizeRequestQuery ?? true),
        createRedactMetaStage(
          new Set(
            (deps.redactMetaKeys ?? DEFAULT_REDACT_META_KEYS).map(key =>
              key.toLowerCase(),
            ),
          ),
        ),
        createTruncateMetaStage(
          deps.maxMetaStringLength ?? DEFAULT_MAX_META_STRING_LENGTH,
        ),
      ],
      sink,
    });
  }

  /**
   * Creates a {@link DefaultAuditorService} instance that writes events to the
   * provided sink.
   */
  static create(
    sink: AuditSink,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
      /** Called when emitting an audit event fails; must not throw. */
      onError?: (error: Error) => void;
      /** Whether query strings are stripped from request URLs. Defaults to `true`. */
      sanitizeRequestQuery?: boolean;
      /** Maximum length of metadata strings, `-1` disables. Defaults to `4096`. */
      maxMetaStringLength?: number;
      /** Metadata keys whose values are redacted; an empty array disables redaction. */
      redactMetaKeys?: string[];
      /**
       * Optional per-severity sampling probabilities between 0 and 1. A
       * probability of `0` drops all events of that severity, except for
       * `critical` where a probability of `0` is rejected.
       */
      sampling?: Partial<Record<AuditorServiceEventSeverityLevel, number>>;
    },
  ): DefaultAuditorService;

  /**
   * Creates a {@link DefaultAuditorService} instance that logs events using a
   * provided callback.
   *
   * @deprecated Use the {@link @backstage/backend-plugin-api#AuditSink} overload instead.
   */
  static create(
    logFn: AuditorLogFunction,
    deps: {
      auth: AuthService;
      httpAuth: HttpAuthService;
      plugin: PluginMetadataService;
    },
  ): DefaultAuditorService;

  static create(
    sinkOrLogFn: AuditSink | AuditorLogFunction,
    deps: DefaultAuditorServiceOptions,
  ): DefaultAuditorService {
    const sink: AuditSink =
      typeof sinkOrLogFn === 'function'
        ? { write: async event => sinkOrLogFn(event) }
        : sinkOrLogFn;

    return new DefaultAuditorService(sink, deps);
  }

  private async log(options: AuditorEventOptions<JsonObject>): Promise<void> {
    const {
      eventId,
      id,
      severityLevel = 'low',
      request,
      actor: actorOverride,
      meta,
      correlationId,
      parentEventId,
      ...rest
    } = options;

    try {
      const actor = await this.resolveActor(request, actorOverride);

      await this.pipeline.emit({
        id: id ?? randomUUID(),
        plugin: this.plugin.getId(),
        eventId,
        severityLevel,
        actor,
        request: request ? this.getRequestDetails(request) : undefined,
        meta,
        correlationId,
        parentEventId,
        ...rest,
      });
    } catch (error) {
      reportAuditError(error, this.onError);
    }
  }

  /**
   * Express requests are recognized structurally by their `originalUrl`; a
   * plain `AuditorEventRequestContext` only carries `url`.
   */
  private isExpressRequest(
    request: NonNullable<AuditorEventOptions<JsonObject>['request']>,
  ): request is Request<any, any, any, any, any> {
    return 'originalUrl' in request;
  }

  private getRequestDetails(
    request: NonNullable<AuditorEventOptions<JsonObject>['request']>,
  ): AuditorEventRequest {
    if (this.isExpressRequest(request)) {
      return { url: request.originalUrl, method: request.method };
    }
    return { url: request.url, method: request.method };
  }

  private async resolveActor(
    request: AuditorEventOptions<JsonObject>['request'],
    actorOverride?: AuditorEventActorDetails,
  ): Promise<AuditorEventActorDetails> {
    let actorId: string | undefined;
    let ip: string | undefined;
    let hostname: string | undefined;
    let userAgent: string | undefined;

    if (request) {
      if (this.isExpressRequest(request)) {
        // Only Express requests carry credentials to resolve the actor from
        actorId = await this.getActorId(request);
        ip = request.ip;
        hostname = request.hostname;
        userAgent = request.get?.('user-agent');
      } else {
        ({ ip, hostname, userAgent } = request);
      }
    } else {
      // Events without a request are attributed to the own service principal
      actorId = await this.getActorId();
    }

    const actor = { actorId, ip, hostname, userAgent };
    return actorOverride ? { ...actor, ...actorOverride } : actor;
  }

  async createEvent(
    options: AuditorServiceCreateEventOptions,
  ): Promise<AuditorServiceEvent> {
    const id = randomUUID();

    if (!this.isSampled(options.severityLevel ?? 'low')) {
      // Sampled-out events keep the real handle semantics; only the emission
      // is dead.
      return new AuditorServiceEventHandle(async () => {}, options, id);
    }

    await this.log({ ...options, id, status: 'initiated' });

    return new AuditorServiceEventHandle(
      eventOptions => this.log(eventOptions),
      options,
      id,
    );
  }

  async withEvent<T>(
    options: AuditorServiceCreateEventOptions,
    fn: (event: AuditorServiceEvent) => Promise<T>,
  ): Promise<T> {
    const event = await this.createEvent(options);

    let result: T;
    try {
      result = await fn(event);
    } catch (error) {
      await event.fail({
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }

    await event.success();
    return result;
  }

  private isSampled(severityLevel: AuditorServiceEventSeverityLevel): boolean {
    const probability = this.sampling?.[severityLevel];
    return probability === undefined || Math.random() < probability;
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
