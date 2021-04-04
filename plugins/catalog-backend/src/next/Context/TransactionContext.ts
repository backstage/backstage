/*
 * Copyright 2021 Spotify AB
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

import { Context, ContextKey } from './types';
import { Knex } from 'knex';
import { ContextWithValue } from './ContextWithValue';

const transactionContextKey = new ContextKey<Knex.Transaction | undefined>(
  undefined,
);

/**
 * TransactionContext handles the wrapping of a knex transaction in a Context.
 */
export class TransactionContext {
  static create(tx: Knex.Transaction, parent?: Context) {
    return ContextWithValue.create(transactionContextKey, tx, parent);
  }

  static getTransaction(context: Context): Knex.Transaction {
    const transaction = context.getContextValue(transactionContextKey);
    if (!transaction) {
      throw new Error(`No transaction available in context`);
    }
    return transaction;
  }
}
