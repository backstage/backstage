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

import { HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import { Duration } from 'luxon';

export const internals = {
  timeInPast(tx: Knex.Transaction, duration: HumanDuration) {
    const seconds = Duration.fromObject(duration).as('seconds');

    if (tx.client.config.client.includes('sqlite3')) {
      return tx.raw(`datetime('now', ?)`, [`${-seconds} seconds`]);
    }

    if (tx.client.config.client.includes('mysql')) {
      return tx.raw(`now() - interval ${seconds} second`);
    }

    return tx.raw(`now() - interval '${seconds} seconds'`);
  },
};

/**
 * Cleans out blobs that are no longer referenced.
 */
export async function vacuumBlobs(options: {
  tx: Knex.Transaction;
  olderThan: HumanDuration;
}): Promise<number> {
  const { tx, olderThan } = options;

  return await tx
    .delete()
    .from('blobs')
    .where('touched_at', '<=', internals.timeInPast(tx, olderThan))
    .whereNotIn('etag', inner =>
      inner
        .distinct('blob_etag')
        .from('delivery_entries')
        .whereNotNull('blob_etag'),
    );
}
