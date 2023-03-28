/*
 * Copyright 2023 The Backstage Authors
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

import crypto from 'crypto';
import { Knex } from 'knex';
import splitToChunks from 'lodash/chunk';

export const internals = {
  computeEtag(blob: string): string {
    return crypto.createHash('sha1').update(blob).digest('base64');
  },
};

/**
 * Given a number of blobs, ensures that they are present in the blobs table.
 * The corresponding rows have their timestamps touched, and the etag values are
 * returned.
 */
export async function ensureBlobs(options: {
  tx: Knex.Transaction;
  blobs: string[];
}): Promise<{ etags: string[] }> {
  const { tx, blobs } = options;

  const etags: string[] = [];
  const rows: { etag: string; touched_at: unknown; data: string }[] = [];

  for (const blob of blobs) {
    const etag = internals.computeEtag(blob);
    etags.push(etag);
    rows.push({ etag, touched_at: tx.fn.now(), data: blob });
  }

  for (const chunk of splitToChunks(rows, 100)) {
    await tx
      .insert(chunk)
      .into('blobs')
      .onConflict('etag')
      .merge(['touched_at']);
  }

  return { etags };
}
