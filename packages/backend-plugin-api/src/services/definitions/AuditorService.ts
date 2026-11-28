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

import type { JsonObject } from '@backstage/types';
import type { Request, Response } from 'express';

/**
 * low (default): normal usage
 * medium: accessing write endpoints
 * high: non-root permission changes
 * critical: root permission changes
 * @public
 */
export type AuditorServiceEventSeverityLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

/** @public */
export type AuditorServiceCreateEventOptions = {
  /**
   * Use kebab-case to name audit events (e.g., "user-login", "file-download", "fetch"). Represents a logical group of similar events or operations. For example, "fetch" could be used as an eventId encompassing various fetch methods like "by-id" or "by-location".
   *
   * The `pluginId` already provides plugin/module context, so avoid redundant prefixes in the `eventId`.
   */
  eventId: string;

  /** (Optional) The severity level for the audit event. */
  severityLevel?: AuditorServiceEventSeverityLevel;

  /**
   * (Optional) The associated HTTP request, if applicable. Accepts either an
   * Express request or a plain {@link AuditorEventRequestContext} for
   * non-HTTP contexts such as task workers, schedulers, and message
   * consumers. Only Express requests drive credential-based actor
   * resolution.
   */
  request?: Request<any, any, any, any, any> | AuditorEventRequestContext;

  /**
   * (Optional) Explicit actor attribution for the event. Fields set here
   * take precedence over the actor derived from the request and credentials —
   * for example a worker auditing on behalf of the user that created its
   * task.
   */
  actor?: AuditorEventActorDetails;

  /**
   * (Optional) Additional metadata relevant to the event, structured as a JSON
   * object.
   *
   * This could include a `queryType` field, using kebab-case, for variations
   * within the main event (e.g., "by-id", "by-user"). For example, if the
   * `eventId` is "fetch", the `queryType` in `meta` could be "by-id" or
   * "by-location".
   */
  meta?: JsonObject;

  /**
   * (Optional) The ID of another audit event that this event was caused by or
   * is part of, forming a chain of related events.
   */
  parentEventId?: string;
};

/**
 * A handle for an audit event created by
 * {@link AuditorService.createEvent}.
 *
 * @public
 */
export type AuditorServiceEvent = {
  /**
   * The unique ID of this event instance, shared by every emission
   * (`initiated`, `succeeded`, `failed`) of the event. Use it as the
   * `parentEventId` of child events.
   */
  readonly id: string;

  /**
   * Merges additional metadata into the event. This is a no-op once the event
   * has been finalized by a call to {@link AuditorServiceEvent.success} or
   * {@link AuditorServiceEvent.fail}.
   */
  update(meta: JsonObject): void;

  /**
   * Marks the event as succeeded. Only the first terminal call
   * (`success` or `fail`) has any effect; later calls are no-ops.
   *
   * This method never rejects: failures to write the event are reported
   * through the service implementation rather than propagated to the caller.
   */
  success(options?: { meta?: JsonObject }): Promise<void>;

  /**
   * Marks the event as failed. Only the first terminal call
   * (`success` or `fail`) has any effect; later calls are no-ops.
   *
   * This method never rejects: failures to write the event are reported
   * through the service implementation rather than propagated to the caller.
   */
  fail(options: { meta?: JsonObject; error: Error }): Promise<void>;

  /**
   * Finalizes the event from an Express response: the event succeeds when the
   * response finishes with a status code below 400, and fails when it finishes
   * with an error status code or the connection closes before the response
   * has finished. The terminal status code is recorded as the `responseStatus`
   * metadata.
   *
   * Only the first terminal call (`success`, `fail`, or this method) has any
   * effect, and the response listeners are removed once the response settles.
   * This method never rejects and never throws.
   */
  attachToResponse(res: Response): void;
};

/**
 * A service that provides an auditor facility.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/auditor | service documentation} for more details.
 *
 * @public
 */
export interface AuditorService {
  createEvent(
    options: AuditorServiceCreateEventOptions,
  ): Promise<AuditorServiceEvent>;

  /**
   * Runs the provided function as an audited operation: the event is created
   * up front, `success` is emitted when the function resolves, and `fail` with
   * the thrown error is emitted when it rejects. The original error is
   * re-thrown after the `fail` event is recorded, and audit write failures are
   * never propagated to the caller.
   *
   * The function receives the event handle so it can call
   * {@link AuditorServiceEvent.update} mid-flight.
   */
  withEvent<T>(
    options: AuditorServiceCreateEventOptions,
    fn: (event: AuditorServiceEvent) => Promise<T>,
  ): Promise<T>;
}

/**
 * A structural description of the request context associated with an audit
 * event, for non-HTTP contexts where no Express request exists.
 *
 * Unlike an Express request, a plain request context does not trigger
 * credential-based actor resolution; use the `actor` option of
 * {@link AuditorServiceCreateEventOptions} to attribute the event explicitly.
 *
 * @public
 */
export type AuditorEventRequestContext = {
  /** The request URL. Query strings are stripped before the event is emitted. */
  url: string;
  /** The request method, e.g. `GET`. */
  method: string;
  /** The IP address the request originated from. */
  ip?: string;
  /** The hostname the request originated from. */
  hostname?: string;
  /** The user agent the request originated from. */
  userAgent?: string;
};

/**
 * Details about the actor that triggered an audit event.
 *
 * @public
 */
export type AuditorEventActorDetails = {
  actorId?: string;
  ip?: string;
  hostname?: string;
  userAgent?: string;
};

/**
 * The HTTP request associated with an audit event, with the query string
 * stripped from the URL.
 *
 * @public
 */
export type AuditorEventRequest = {
  url: string;
  method: string;
};

/**
 * The status of an audit event.
 *
 * @public
 */
export type AuditorEventStatus =
  | { status: 'initiated' }
  | { status: 'succeeded' }
  | {
      status: 'failed';
      /**
       * The serialized failure reason. A live `Error` is never emitted to a
       * sink; it is converted to this shape when the event is finalized.
       */
      error: { name: string; message: string; stack?: string };
    };

/**
 * An audit event as emitted to an {@link AuditSink}.
 *
 * @public
 */
export type AuditorEvent = {
  /** The unique ID of this event instance. */
  id: string;
  plugin: string;
  eventId: string;
  /**
   * The time the event was created, as an ISO 8601 string. Captured once at
   * event creation and shared by all emissions of the event, so that sinks
   * have an authoritative time even when a terminal emission happens later.
   */
  timestamp: string;
  severityLevel: AuditorServiceEventSeverityLevel;
  actor: AuditorEventActorDetails;
  meta?: JsonObject;
  request?: AuditorEventRequest;
  /** (Optional) ID of the audit event that this event was caused by. */
  parentEventId?: string;
  /**
   * (Optional) The OpenTelemetry trace ID of the span that was active when
   * the event was created, when one exists.
   */
  traceId?: string;
  /**
   * (Optional) The OpenTelemetry span ID of the span that was active when
   * the event was created, when one exists.
   */
  spanId?: string;
  /**
   * The version of the audit event schema. Version 1 is the legacy shape
   * emitted before this field existed, detected by its absence; version 2 is
   * the current shape, including `id`, `timestamp`, `traceId`/`spanId`,
   * `parentEventId`, the serializable error shape, and `responseStatus`
   * metadata.
   */
  schemaVersion: AuditorEventSchemaVersion;
} & AuditorEventStatus;

/**
 * The schema version stamped on every {@link AuditorEvent} emitted by the
 * auditor service.
 *
 * @public
 */
export type AuditorEventSchemaVersion = 2;

/**
 * A port for writing audit events to a destination such as a log transport or
 * a database. Implementations are used by the default auditor service to
 * persist emitted events.
 *
 * @public
 */
export interface AuditSink {
  write(event: AuditorEvent): Promise<void>;
}
