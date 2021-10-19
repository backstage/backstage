/*
 * Copyright 2021 The Backstage Authors
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

import { Logger } from 'winston';
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  Settings,
  WriteResult,
} from '@google-cloud/firestore';

import { AnyJWK, KeyStore, StoredKey } from './types';

export type FirestoreKeyStoreSettings = Settings & Options;

type Options = {
  path?: string;
  timeout?: number;
};

export const DEFAULT_TIMEOUT_MS = 10000;
export const DEFAULT_DOCUMENT_PATH = 'sessions';

export class FirestoreKeyStore implements KeyStore {
  static async create(
    settings?: FirestoreKeyStoreSettings,
  ): Promise<FirestoreKeyStore> {
    const { path, timeout, ...firestoreSettings } = settings ?? {};
    const database = new Firestore(firestoreSettings);

    return new FirestoreKeyStore(
      database,
      path ?? DEFAULT_DOCUMENT_PATH,
      timeout ?? DEFAULT_TIMEOUT_MS,
    );
  }

  private constructor(
    private readonly database: Firestore,
    private readonly path: string,
    private readonly timeout: number,
  ) {}

  static async verifyConnection(
    keyStore: FirestoreKeyStore,
    logger?: Logger,
  ): Promise<void> {
    try {
      await keyStore.verify();
    } catch (error) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          `Failed to connect to database: ${(error as Error).message}`,
        );
      }
      logger?.warn(
        `Failed to connect to database: ${(error as Error).message}`,
      );
    }
  }

  async addKey(key: AnyJWK): Promise<void> {
    await this.withTimeout<WriteResult>(
      this.database
        .collection(this.path)
        .doc(key.kid)
        .set({
          kid: key.kid,
          key: JSON.stringify(key),
        }),
    );
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    const keys = await this.withTimeout<QuerySnapshot<DocumentData>>(
      this.database.collection(this.path).get(),
    );

    return {
      items: keys.docs.map(key => ({
        key: key.data() as AnyJWK,
        createdAt: key.createTime.toDate(),
      })),
    };
  }

  async removeKeys(kids: string[]): Promise<void> {
    // This is probably really slow, but it's done async in the background
    for (const kid of kids) {
      await this.withTimeout<WriteResult>(
        this.database.collection(this.path).doc(kid).delete(),
      );
    }

    /**
     * This could be achieved with batching but there's a couple of limitations with that:
     *
     * - A batched write can contain a maximum of 500 operations
     *  https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
     *
     * - The "in" operator can combine a maximum of 10 equality clauses
     *  https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any
     *
     * Example:
     *
     *  const batch = this.database.batch();
     *  const docs = await this.database
     *    .collection(this.path)
     *    .where('kid', 'in', kids)
     *    .get();
     *  docs.forEach(doc => {
     *    batch.delete(doc.ref);
     *  });
     *  await batch.commit();
     *
     */
  }

  /**
   * Helper function to allow us to modify the timeout used when
   * performing Firestore database operations.
   *
   * The reason for this is that it seems that there's no other
   * practical solution to change the default timeout of 10mins
   * that Firestore has.
   *
   */
  private async withTimeout<T>(operation: Promise<T>): Promise<T> {
    const timer = new Promise<never>((_, reject) =>
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.timeout}ms`));
      }, this.timeout),
    );
    return Promise.race<T>([operation, timer]);
  }

  /**
   * Used to verify that the database is reachable.
   */
  private async verify(): Promise<void> {
    await this.withTimeout(this.database.collection(this.path).limit(1).get());
  }
}
