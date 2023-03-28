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

export async function transaction<TReturn>(
  knex: Knex,
  fn: (tx: Knex.Transaction) => Promise<TReturn>,
): Promise<TReturn> {
  let result: TReturn;
  await knex.transaction(
    async tx => {
      // We can't return here, as knex swallows the return type in case the
      // transaction is rolled back:
      // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
      result = await fn(tx);
    },
    {
      // If we explicitly trigger a rollback, don't fail.
      doNotRejectOnRollback: true,
    },
  );
  return result!;
}

export function computeHash(blob: string): string {
  return crypto.createHash('sha1').update(blob).digest('base64');
}
