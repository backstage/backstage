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

import { DefaultAuditorService } from '@backstage/backend-defaults/auditor';
import type {
  AuditorEvent,
  AuditorService,
} from '@backstage/backend-plugin-api';
import { mockServices } from '../services/mockServices';

/**
 * A capturing {@link @backstage/backend-plugin-api#AuditorService} that
 * records every emitted audit event, including the full
 * initiated/succeeded/failed lifecycle, merged metadata and the serialized
 * failure reason, so that caller assertions can be made directly against the
 * emitted events.
 *
 * This is the real default auditor service with a capturing sink, so captured
 * events have exactly the shape that a custom sink would receive. Request
 * query sanitization and metadata redaction/truncation are disabled, and the
 * actor records the request's `ip`, `hostname` and user agent without any
 * credential resolution, so `actorId` stays absent. The `plugin` field is
 * reported as `test`.
 *
 * @returns An auditor instance together with the array of captured events.
 *
 * @public
 *
 * @example
 * ```ts
 * const { auditor, events } = captureAuditor();
 * await auditor.withEvent({ eventId: 'fetch' }, async () => 'result');
 * expect(events[0].status).toBe('initiated');
 * expect(events[1].status).toBe('succeeded');
 * ```
 */
export function captureAuditor(): {
  auditor: AuditorService;
  events: AuditorEvent[];
} {
  const events: AuditorEvent[] = [];

  const auditor = DefaultAuditorService.create(
    {
      write: async event => {
        events.push(event);
      },
    },
    {
      auth: mockServices.auth.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      plugin: {
        getId: () => 'test',
      },
      sanitizeRequestQuery: false,
      maxMetaStringLength: -1,
      redactMetaKeys: [],
    },
  );

  return { auditor, events };
}
