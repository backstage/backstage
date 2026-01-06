/*
 * Copyright 2025 The Backstage Authors
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

import { Request } from 'express';
import {
  AuditorService,
  AuditorServiceEventSeverityLevel,
} from '@backstage/backend-plugin-api';

/** @internal */
export type AuditEventMeta = {
  providerId?: string;
  actionType?: 'login' | 'logout';
  userEntityRef?: string;
  email?: string;
};

/** @internal */
export function emitAuditEvent(
  auditor: AuditorService | undefined,
  options: {
    eventId: string;
    request: Request;
    severityLevel: AuditorServiceEventSeverityLevel;
    meta: AuditEventMeta;
    error?: Error;
  },
): void {
  if (!auditor) return;

  const { eventId, request, severityLevel, meta, error } = options;

  (async () => {
    const auditEvent = await auditor.createEvent({
      eventId,
      request,
      severityLevel,
      meta: {
        ...meta,
        outcome: error ? 'failure' : 'success',
      },
    });

    if (error) {
      await auditEvent.fail({ error });
    } else {
      await auditEvent.success();
    }
  })().catch(() => {});
}
