/*
 * Copyright 2026 The Backstage Authors
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

import type { AuditSink } from '@backstage/backend-plugin-api';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { SeverityLogLevelMappings } from './utils';

/**
 * Creates an {@link AuditSink} that writes audit events to a logger, marking
 * them with `isAuditEvent` and mapping severity levels to log levels.
 *
 * @internal
 */
export function createWinstonAuditSink(
  logger: LoggerService,
  severityLogLevelMappings: SeverityLogLevelMappings,
): AuditSink {
  const auditLogger = logger.child({ isAuditEvent: true });
  return {
    write: async event => {
      auditLogger[severityLogLevelMappings[event.severityLevel]](
        `${event.plugin}.${event.eventId}`,
        event,
      );
    },
  };
}
