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

import type { Knex } from 'knex';
import type { PermissionsService } from '@backstage/backend-plugin-api';
import { readSessionOrigin } from '../ownership/recovery';
import { createAttemptJournal } from './knex';
import type { AttemptJournal } from './types';
import { AI_AUDIT_READ_PERMISSION_NAME } from './types';

/**
 * Builds the attempt journal wired the way the managed AI service and its
 * HTTP facade both consume it: session ownership resolves through the
 * ownership module's recovery sessions (not the journal's own records), and
 * audit reads check the separate `ai.audit.read` permission through the
 * permissions service.
 *
 * @remarks
 *
 * The single wiring keeps the two consumers from drifting: a session owned
 * by a user principal resolves to the raw user entity reference, a service
 * principal to `plugin:<pluginId>` — the journal's principal-reference
 * convention. A persisted origin that cannot be mapped resolves as unknown
 * rather than failing the read.
 *
 * @internal
 */
export function createWiredAttemptJournal(options: {
  db: Knex;
  permissions: Pick<PermissionsService, 'authorize'>;
  /** Provider routes and operation classifications approved by the host. */
  providers?: Parameters<typeof createAttemptJournal>[0]['providers'];
  /** Best-effort write-through mirror to the Backstage auditor service. */
  mirror?: Parameters<typeof createAttemptJournal>[0]['mirror'];
}): AttemptJournal {
  return createAttemptJournal({
    db: options.db,
    ...(options.providers === undefined
      ? {}
      : { providers: options.providers }),
    authorizer: {
      authorizeAuditRead: async credentials => {
        const decisions = await options.permissions.authorize(
          [
            {
              permission: {
                type: 'basic',
                name: AI_AUDIT_READ_PERMISSION_NAME,
                attributes: {},
              },
            },
          ],
          { credentials },
        );
        return decisions.length === 1 && decisions[0]?.result === 'ALLOW';
      },
    },
    // Session ownership for audit reads resolves through the ownership
    // module's recovery sessions, not the journal's own records.
    ownershipResolver: async namespace => {
      try {
        const origin = await readSessionOrigin(options.db, namespace);
        if (origin?.kind === 'user') {
          return origin.userId;
        }
        if (origin?.kind === 'service') {
          return `plugin:${origin.pluginId}`;
        }
      } catch {
        /* A persisted origin that cannot be mapped resolves as unknown. */
      }
      return undefined;
    },
    ...(options.mirror === undefined ? {} : { mirror: options.mirror }),
  });
}
