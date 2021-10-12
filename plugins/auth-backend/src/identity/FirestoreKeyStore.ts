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

import { Firestore, Settings } from '@google-cloud/firestore';

import { AnyJWK, KeyStore, StoredKey } from './types';

type FirestoreSettings = Settings & {
  path?: string;
};

export class FirestoreKeyStore implements KeyStore {
  static create(settings?: FirestoreSettings): FirestoreKeyStore {
    const { projectId, keyFilename, path } = settings ?? {};
    const database = new Firestore({
      projectId,
      keyFilename: keyFilename ?? process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    return new FirestoreKeyStore(database, path ?? 'sessions');
  }

  private constructor(
    private readonly database: Firestore,
    private readonly path: string,
  ) {}

  async addKey(key: AnyJWK): Promise<void> {
    await this.database
      .collection(this.path)
      .doc(key.kid)
      .set({
        kid: key.kid,
        key: JSON.stringify(key),
      });
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    const docs = await this.database.collection(this.path).get();
    return {
      items: docs.docs.map(doc => ({
        key: doc.data() as AnyJWK,
        createdAt: doc.createTime.toDate(),
      })),
    };
  }

  async removeKeys(kids: string[]): Promise<void> {
    // This is probably really slow, but it's done async in the background
    for (const kid of kids) {
      await this.database.collection(this.path).doc(kid).delete();
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
}
