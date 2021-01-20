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

/**
 * The core database implementation.
 */
export interface Database {
  /**
   * Runs a transaction.
   *
   * The callback is expected to make calls back into this class. When it
   * completes, the transaction is closed.
   *
   * @param fn The callback that implements the transaction
   */
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
}

/**
 * An abstraction for transactions of the underlying database technology.
 */
export type Transaction = {
  rollback(): Promise<void>;
};
