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

  /** (Optional) The associated HTTP request, if applicable. */
  request?: Request<any, any, any, any, any>;

  /**
   * (Optional) Additional metadata relevant to the event, structured as a JSON object.
   * This could include a `queryType` field, using kebab-case, for variations within the main event (e.g., "by-id", "by-user").
   * For example, if the `eventId` is "fetch", the `queryType` in `meta` could be "by-id" or "by-location".
   */
  meta?: JsonObject;
};

/** @public */
export type AuditorServiceEvent = {
  success(options?: { meta?: JsonObject }): Promise<void>;
  fail(options: { meta?: JsonObject; error: Error }): Promise<void>;
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
}
