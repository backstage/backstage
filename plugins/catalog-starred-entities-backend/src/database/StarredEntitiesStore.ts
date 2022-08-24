/*
 * Copyright 2022 The Backstage Authors
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
import { CompoundEntityRef } from '@backstage/catalog-model';

/**
 * Store definition for the starred entities.
 *
 * @public
 */
export interface StarredEntitiesStore<Transaction> {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Get a list of all starred entities of the selected user.
   *
   * @param tx - the transaction
   * @param opts - the user ID to read from
   */
  getStarredEntities(
    tx: Transaction,
    opts: { userId: string },
  ): Promise<string[]>;

  /**
   * Star an entity of the selected user
   *
   * @param tx - the transaction
   * @param opts - the user ID and entity to toggle
   */
  starEntity(
    tx: Transaction,
    opts: { userId: string; entity: CompoundEntityRef },
  ): Promise<void>;

  /**
   * Toggle a starred entity of the selected user
   *
   * @param tx - the transaction
   * @param opts - the user ID and entityR to toggle
   */
  toggleEntity(
    tx: Transaction,
    opts: { userId: string; entity: CompoundEntityRef },
  ): Promise<void>;
}
