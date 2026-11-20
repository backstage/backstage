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
import type { Fence } from '../contracts';
import { fencedTransaction } from '../storage/dialect-kit';
import { assertEncryptionKey } from './encryption';
import { assertIdentifier } from './identifiers';
import {
  CREDENTIAL_SECRETS_TABLE,
  EncryptedUserCredentialStore,
} from './EncryptedUserCredentialStore';

const PAGE_SIZE = 100;

/** A trusted host operation; never returns credential contents. */
export function createCredentialRotation(options: {
  db: Knex;
  encryptionKey: Uint8Array;
  previousEncryptionKey: Uint8Array;
}): { rotate(fence: Fence): Promise<{ inspected: number; rotated: number }> } {
  const { db } = options;
  const encryptionKey = assertEncryptionKey(options.encryptionKey);
  const previousEncryptionKey = assertEncryptionKey(
    options.previousEncryptionKey,
  );
  return {
    async rotate(fence) {
      const key = {
        plugin_id: fence.namespace.pluginId,
        session_id: fence.namespace.sessionId,
      };
      let cursor: { scope: string; provider_id: string } | undefined;
      let inspected = 0;
      let rotated = 0;
      for (;;) {
        const last = cursor;
        const page: Array<{ scope: string; provider_id: string }> =
          await fencedTransaction(
            db,
            key,
            fence,
            'Credential rotation fence is stale',
            async () => undefined,
            async trx => {
              const query = trx(CREDENTIAL_SECRETS_TABLE)
                .select('scope', 'provider_id')
                .where('scope', 'like', 'user:%')
                .orderBy('scope')
                .orderBy('provider_id')
                .limit(PAGE_SIZE);
              if (last) {
                query.andWhere(builder =>
                  builder
                    .where('scope', '>', last.scope)
                    .orWhere(inner =>
                      inner
                        .where('scope', last.scope)
                        .andWhere('provider_id', '>', last.provider_id),
                    ),
                );
              }
              return query;
            },
          );
        if (page.length === 0) return { inspected, rotated };
        for (const row of page) {
          if (!row.scope.startsWith('user:')) {
            throw new Error('Invalid personal credential scope');
          }
          assertIdentifier(row.scope.slice('user:'.length), 'user scope id');
          const store = new EncryptedUserCredentialStore({
            db,
            encryptionKey,
            previousEncryptionKey,
            scopeKey: row.scope,
          });
          if (await store.rotate(row.provider_id, fence)) rotated++;
          inspected++;
        }
        cursor = page[page.length - 1];
      }
    },
  };
}
