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
import type { Request } from 'express';

/**
 * low (default): normal usage
 * medium: accessing write endpoints
 * high: non-root permission changes
 * critical: root permission changes
 * @public
 */
export type AuditorEventSeverityLevel = 'low' | 'medium' | 'high' | 'critical';

/** @public */
export type AuditorCreateEvent<TRootMeta extends JsonObject> = (options: {
  /**
   * Use kebab-case to name audit events (e.g., "user-login", "file-download", "fetch"). Represents a logical group of similar events or operations. For example, "fetch" could be used as an eventId encompassing various fetch methods like "by-id" or "by-location".
   *
   * The `pluginId` already provides plugin/module context, so avoid redundant prefixes in the `eventId`.
   */
  eventId: string;

  /**
   * Use kebab-case to name sub-events (e.g., "by-id", "by-user").
   *
   * (Optional) The ID for a sub-event or related action within the main event.  This allows further categorization of events within a logical group. For example, if the `eventId` is "fetch", the `subEventId` could be "by-id" or "by-location" to specify the method used for fetching.
   */
  subEventId?: string;

  /** (Optional) The severity level for the audit event. */
  severityLevel?: AuditorEventSeverityLevel;

  /** (Optional) The associated HTTP request, if applicable. */
  request?: Request<any, any, any, any, any>;

  /** (Optional) Additional metadata relevant to the event, structured as a JSON object. */
  meta?: TRootMeta;

  /** (Optional) Suppresses the automatic initial event. */
  suppressInitialEvent?: boolean;
}) => Promise<{
  success<TMeta extends JsonObject>(options?: { meta?: TMeta }): Promise<void>;
  fail<TMeta extends JsonObject, TError extends Error>(
    options: {
      meta?: TMeta;
    } & ({ error: TError } | { errors: TError[] }),
  ): Promise<void>;
}>;

/**
 * A service that provides an auditor facility.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/auditor | service documentation} for more details.
 *
 * @public
 */
export interface AuditorService {
  createEvent<TMeta extends JsonObject>(
    options: Parameters<AuditorCreateEvent<TMeta>>[0],
  ): ReturnType<AuditorCreateEvent<TMeta>>;
}
