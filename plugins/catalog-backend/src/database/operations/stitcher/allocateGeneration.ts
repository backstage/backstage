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

import { Knex } from 'knex';

/**
 * Allocates a commit-ordered publication generation, retaining the counter's
 * row lock until the caller commits. Call only after taking all other write
 * locks, and commit promptly afterward. Rollback also rolls back allocation.
 * The decimal string avoids losing bigint precision in JavaScript.
 */
export async function allocateGeneration(
  tx: Knex.Transaction,
): Promise<string> {
  const client = tx.client.config.client as string;
  let generation: string | undefined;
  if (client.includes('pg')) {
    const { rows } = await tx.raw(
      'SELECT catalog_next_generation()::text AS generation',
    );
    generation = rows[0]?.generation;
  } else {
    await tx('catalog_generation_counter')
      .where('id', 1)
      .update({ generation: tx.raw('generation + 1') });
    const row = await tx('catalog_generation_counter')
      .where('id', 1)
      .select(
        tx.raw(
          `CAST(generation AS ${
            client.includes('mysql') ? 'CHAR' : 'TEXT'
          }) AS generation`,
        ),
      )
      .first();
    generation = row?.generation;
  }
  if (typeof generation !== 'string' || !/^\d+$/.test(generation)) {
    throw new Error(
      'Catalog publication generation counter is missing or invalid',
    );
  }
  return generation;
}
